#!/usr/bin/env python3
"""Debug script to check transcript availability"""

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

video_id = "0h6gfMqpx_0"

print(f"Checking video ID: {video_id}\n")

try:
    # Try to get transcript
    print("Attempting to fetch transcript...")
    api = YouTubeTranscriptApi()
    fetched = api.fetch(video_id)
    transcript = fetched.fetch()
    print(f"✓ Success! Found {len(transcript)} entries")
    print(f"\nFirst entry: {transcript[0]}")
    print(f"\nFirst 500 chars of transcript:")
    full_text = ' '.join([entry['text'] for entry in transcript])
    print(full_text[:500])
except TranscriptsDisabled:
    print("✗ Transcripts are disabled for this video")
except NoTranscriptFound:
    print("✗ No transcript found")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

# Try with different languages
print("\n" + "="*50)
print("Trying different languages...")
for lang in ['ko', 'en', 'ja', 'es', 'fr']:
    try:
        api = YouTubeTranscriptApi()
        fetched = api.fetch(video_id, [lang])
        transcript = fetched.fetch()
        print(f"✓ {lang}: Found {len(transcript)} entries")
    except Exception as e:
        print(f"✗ {lang}: {type(e).__name__}")
