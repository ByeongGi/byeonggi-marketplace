# YouTube Summarizer Plugin

Extract YouTube video transcripts and generate intelligent AI-powered summaries with timestamp support.

## Features

- Extract YouTube video captions and transcripts
- Support for multiple languages (Korean, English, and more)
- Timestamped transcript data
- AI-powered intelligent summaries
- Automatic summary storage as markdown files

## Installation

### Prerequisites

- Python 3.7 or higher
- Internet connectivity
- YouTube videos must have captions available (manual or auto-generated)

### Setup Python Environment

#### Using virtualenv (macOS/Linux)

```bash
cd plugins/youtube-summarizer
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### Using virtualenv (Windows)

```bash
cd plugins\youtube-summarizer
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### Alternative: Using uv

```bash
cd plugins/youtube-summarizer
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

### Python Scripts

The Python extraction scripts need to be copied from the original repository:
https://github.com/ByeongGi/youtube-summarizer-skill

Copy the following files to `plugins/youtube-summarizer/scripts/`:
- `extract_transcript.py` - Main transcript extraction script
- `debug_transcript.py` - Debugging utility

## Usage

### In Claude Code Conversations

Simply provide a YouTube URL in your conversation:

```
Summarize this YouTube video: https://www.youtube.com/watch?v=VIDEO_ID
```

The skill will automatically:
1. Extract the transcript
2. Analyze the content
3. Generate a structured summary
4. Save the summary to the `summaries/` directory

### Direct Script Usage (Optional)

You can also run the extraction script directly:

```bash
.venv/bin/python scripts/extract_transcript.py <youtube_url> [language_codes...]
```

Example:
```bash
.venv/bin/python scripts/extract_transcript.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" ko en
```

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID&t=123s`

## Output Format

The extraction script returns JSON with:

```json
{
  "video_id": "VIDEO_ID",
  "language": "en",
  "transcript": "Full transcript text...",
  "timestamped_entries": [
    {
      "text": "Segment text",
      "start": 0.0,
      "duration": 5.5
    }
  ]
}
```

## Summary Types

The skill can generate various summary formats:

- **Concise Overview**: 3-5 sentence summaries
- **Detailed Breakdown**: Section-by-section analysis
- **Timestamped Key Points**: Important moments with navigation timestamps
- **Q&A Format**: Answers to specific questions
- **Topic Extraction**: Main themes and subjects

## Troubleshooting

### No Transcript Available

**Error**: Video doesn't have captions
**Solution**: Check if the video has manual or auto-generated captions enabled

### Transcripts Disabled

**Error**: Transcript retrieval is disabled
**Solution**: Try a different video or check if the video owner has disabled transcripts

### Virtual Environment Issues

**Error**: Module not found
**Solution**: Ensure virtual environment is activated and dependencies are installed:

```bash
source .venv/bin/activate  # Activate environment
pip install -r requirements.txt  # Install dependencies
```

## Directory Structure

```
plugins/youtube-summarizer/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── youtube-summarizer/
│       └── SKILL.md         # Skill definition
├── scripts/
│   ├── extract_transcript.py  # Main extraction script
│   └── debug_transcript.py    # Debugging utility
├── summaries/               # Auto-generated summaries (gitignored)
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Technical Details

- **Primary Dependency**: `youtube-transcript-api`
- **Language Support**: Korean, English, Japanese, Spanish, French, and more
- **Output Storage**: `summaries/` directory (markdown format)
- **Python Version**: 3.7+

## License

MIT

## Repository

Original skill: https://github.com/ByeongGi/youtube-summarizer-skill
