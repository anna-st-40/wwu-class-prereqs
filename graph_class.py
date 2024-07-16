from playwright.sync_api import sync_playwright, Playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.goto("https://wallawalla.smartcatalogiq.com/en/current/undergraduate-bulletin/courses/")

        elements = page.query_selector_all('.sc-child-item-links li a')

        for element in elements:
            print(element.inner_text())


        browser.close()

if __name__ == "__main__":
    main()