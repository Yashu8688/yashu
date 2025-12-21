# Task: Fix Start Date Extraction in Documents

## Problem
The OCR processor is incorrectly identifying birth dates as start dates instead of issue dates, while expiry dates are correct.

## Plan
- Remove birth-related keywords from start_keywords_priority list in ocr_processor.py
- Keywords to remove: "date of birth", "dob", "place of birth", "birth date"

## Steps
- [x] Edit ocr_processor.py to remove birth-related keywords from start_keywords_priority
- [ ] Test the changes (if needed)
