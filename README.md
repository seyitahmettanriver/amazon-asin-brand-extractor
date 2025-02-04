# Amazon ASIN Brand Extractor

## Description
Amazon ASIN Brand Extractor is a userscript that retrieves brand information for given ASINs from Amazon.com and displays the results in a modern panel. The script processes ASINs in batches, extracts brand names from the product pages, and provides a progress bar and timer for better tracking.

## Features
- Retrieves brand names for ASINs from Amazon product pages.
- Modern and user-friendly interface.
- Batch processing for efficiency.
- Progress bar and timer to track the process.
- Removes unnecessary text (e.g., "Visit the" from brand names).

## Installation
1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Greasemonkey](https://www.greasespot.net/)
2. Click the following link to install the script:
   - [Amazon ASIN Brand Extractor](#)
3. Open Amazon.com and start using the tool.


## Usage
1. Navigate to [Amazon.com](https://www.amazon.com/).
2. Enter ASINs in the provided input box (one per line).
3. Click the "Kontrol Et" button to start extraction.
4. Wait for the progress bar to complete.
5. View the extracted brand names in the results box.

## Technical Details
- Uses `GM_xmlhttpRequest` for fetching Amazon product pages.
- jQuery-powered UI for a smooth experience.
- Extracts brand name from the `#bylineInfo` element.
- Processes ASINs in batches of 2 for efficiency.

## Developer
- **Seyit Ahmet TANRIVER**
- Contact: [WhatsApp](https://wa.me/31637952159)

## License
This project is licensed under the MIT License.
