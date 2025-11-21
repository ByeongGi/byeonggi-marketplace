---
name: youtube-summarizer
description: |
  Extract YouTube video transcripts and generate intelligent summaries
  with timestamp support. Use when users provide YouTube URLs seeking
  summaries, content extraction without full video viewing, or timestamped
  breakdowns. Triggers on YouTube links, video summarization requests,
  transcript extraction, and caption-related tasks.
---

# YouTube Summarizer

Extract YouTube video transcripts and generate intelligent summaries with timestamp support.

## Purpose

This skill extracts YouTube video transcripts and generates intelligent summaries, supporting multiple languages including Korean and English.

## When to Use

Use this skill when:
- Users provide YouTube URLs seeking summaries or analysis
- Content extraction without full video viewing is needed
- Transcript extraction and timestamped breakdowns are required

## How It Works

1. **Extract Transcript**: Run the extraction script with the YouTube URL
   ```bash
   .venv/bin/python skills/youtube-summarizer/scripts/extract_transcript.py <youtube_url> [language_codes]
   ```

2. **Analyze Content**: Process the extracted transcript data

3. **Generate Summary**: Create structured summaries based on user needs

4. **Save Output**: Store formatted summaries in the `summaries/` directory in the user's project root

## Output Format

The extraction script returns JSON containing:
- `video_id`: Extracted YouTube video identifier
- `language`: Transcript language code used
- `transcript`: Complete transcript text
- `timestamped_entries`: Array of segments with time markers
- `error`: Error message if extraction fails

## Summary Options

Adapt output based on user needs:
- **Concise Overview**: 3-5 sentence summaries
- **Detailed Breakdown**: Section-by-section analysis
- **Timestamped Points**: Key moments with timestamps for navigation
- **Q&A Format**: Answers to specific questions about the video
- **Topic Extraction**: Identification of main themes

## Technical Requirements

- **Python Environment**: Pre-configured virtual environment with dependencies
- **Dependencies**: `youtube-transcript-api` package
- **Video Requirements**: Public YouTube videos with captions/subtitles available

## Scope and Limitations

- Works only with public YouTube videos
- Requires available captions (auto-generated or manual)
- Respects YouTube's terms of service
- Internet connectivity required

## Example Usage

**User Request:**
"Summarize this YouTube video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"

**Workflow:**
1. Extract transcript using the Python script
2. Analyze the returned JSON data
3. Generate a concise summary with key points
4. Include timestamps for important sections
5. Save the summary to `summaries/` directory in the user's project root
