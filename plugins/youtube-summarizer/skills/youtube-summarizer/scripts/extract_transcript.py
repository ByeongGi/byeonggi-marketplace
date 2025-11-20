#!/usr/bin/env python3
"""
Extract transcript from YouTube video URL
Usage: python extract_transcript.py <youtube_url> [language_codes...]
"""

import sys
import json
import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


def extract_video_id(url):
    """Extract video ID from various YouTube URL formats"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
        r'youtube\.com\/embed\/([^&\n?#]+)',
        r'youtube\.com\/v\/([^&\n?#]+)'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    # If no pattern matches, assume the input is already a video ID
    if len(url) == 11 and not '/' in url:
        return url

    return None


def get_transcript(video_url, languages=None):
    """Fetch transcript from YouTube video"""
    if languages is None:
        languages = ['ko', 'en']

    video_id = extract_video_id(video_url)

    if not video_id:
        return {
            'error': 'Invalid YouTube URL',
            'video_id': None
        }

    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)

        # Try to find transcript in preferred languages
        transcript = None
        used_language = None

        for lang in languages:
            try:
                for t in transcript_list:
                    if t.language_code.startswith(lang):
                        transcript = t
                        used_language = lang
                        break
                if transcript:
                    break
            except:
                continue

        # If no preferred language found, use first available
        if not transcript:
            available = list(transcript_list)
            if available:
                transcript = available[0]
                used_language = transcript.language_code

        if transcript:
            # Fetch the actual transcript data
            transcript_data = transcript.fetch()

            # Format transcript
            full_text = ' '.join([entry.text for entry in transcript_data])

            return {
                'video_id': video_id,
                'language': used_language,
                'transcript': full_text,
                'timestamped_entries': [
                    {
                        'text': entry.text,
                        'start': entry.start,
                        'duration': entry.duration
                    }
                    for entry in transcript_data
                ]
            }
        else:
            return {
                'error': 'No transcript available',
                'video_id': video_id
            }

    except TranscriptsDisabled:
        return {
            'error': 'Transcripts are disabled for this video',
            'video_id': video_id
        }
    except NoTranscriptFound:
        return {
            'error': 'No transcript found for this video',
            'video_id': video_id
        }
    except Exception as e:
        return {
            'error': f'Error fetching transcript: {str(e)}',
            'video_id': video_id
        }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'error': 'Usage: python extract_transcript.py <youtube_url> [language_codes...]'
        }, indent=2))
        sys.exit(1)

    video_url = sys.argv[1]
    languages = sys.argv[2:] if len(sys.argv) > 2 else None

    result = get_transcript(video_url, languages)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
