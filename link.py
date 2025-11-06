# File: link.py (Final Robust Version with Safety Check)

import json
from scholarly import scholarly
import sys

# --- CONFIGURE YOUR SCHOLAR ID HERE ---
SCHOLAR_ID = '7gd1_3MAAAAJ'
# --- END OF CONFIGURATION ---


if 'Your_Scholar_ID_Here' in SCHOLAR_ID:
    print("❌ ERROR: Please replace the placeholder 'Your_Scholar_ID_Here' at the top of the script.")
    sys.exit(1)

print("Starting to fetch data directly from Google Scholar...")
print("-" * 30)

try:
    author = scholarly.search_author_id(SCHOLAR_ID)
    print(f"Found author: {author['name']}")

    filled_author = scholarly.fill(author, sections=['publications'])

    publication_list = []
    total_pubs = len(filled_author['publications'])
    skipped_pubs = 0
    print(f"Found {total_pubs} publications. Processing now...")

    for i, pub in enumerate(filled_author['publications']):
        print(f"  ({i+1}/{total_pubs}) Processing...", end="", flush=True)
        filled_pub = scholarly.fill(pub)

        # --- THIS IS THE SAFETY CHECK ---
        # If fetching details for a specific publication fails, skip it
        if not filled_pub:
            print(" -> ⚠️  Could not fetch details, skipping.")
            skipped_pubs += 1
            continue # Go to the next publication in the list
        # --- END OF SAFETY CHECK ---

        bib = filled_pub.get('bib', {})
        
        # Enhanced data fetching to handle inconsistent keys
        venue = bib.get('journal') or bib.get('booktitle') or bib.get('conference') or bib.get('publisher') or bib.get('institution') or bib.get('venue', 'N/A')
        year = bib.get('pub_year') or bib.get('year', 'N/A')
        authors_raw = bib.get('author', 'N/A')
        
        authors = authors_raw
        if isinstance(authors_raw, list):
            authors = ', '.join(authors_raw)
        authors = authors.replace(' and ', ', ')

        title = bib.get('title', 'Untitled Publication')
        
        publication_data = {
            'title': title,
            'authors': authors,
            'venue': venue,
            'year': year,
            'url': filled_pub.get('pub_url', '#')
        }
        publication_list.append(publication_data)
        print(f" -> Done: {title}")

    with open('publications.json', 'w') as f:
        json.dump(publication_list, f, indent=2)

    print("-" * 30)
    print(f"\n✅ Success! Data for {len(publication_list)} publications saved to publications.json.")
    if skipped_pubs > 0:
        print(f"⚠️  Note: {skipped_pubs} publication(s) were skipped due to missing details on Google Scholar.")

except Exception as e:
    print(f"\n❌ An unexpected error occurred: {e}")