from playwright.sync_api import sync_playwright
import json

def get_department_links(page) -> list:
    departments = page.query_selector_all('.sc-child-item-links li a')
    department_links = ["https://wallawalla.smartcatalogiq.com" + d.get_attribute('href') for d in departments]
    return department_links

def get_course_links(page) -> list:
    courses = page.query_selector_all('.sc-child-item-links li a')
    course_links = ["https://wallawalla.smartcatalogiq.com" + c.get_attribute('href') for c in courses]
    return course_links

def get_prereq_codes(page) -> list:
    if page.query_selector('h3:has-text("Prerequisite")'):
        prereqs = page.query_selector_all(".sc_prereqs a")
        return [e.inner_html() for e in prereqs]
        
def course_code(url) -> str:
    value = url.split('/')[-1].split('-')
    course_code, course_number = value[0], value[1]
    return f"{course_code.upper()} {course_number}"

def prereq_dict() -> dict:
    """
    Returns a dictionary with class code as the key and a list of class codes of the prerequisites as the value.
    """

    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to page
        page.goto("https://wallawalla.smartcatalogiq.com/en/current/undergraduate-bulletin/courses")

        # Initiate dictionary
        course_prereqs = {}

        departments = get_department_links(page)
        departments = departments[:2] #FOR TESTING

        for department in departments:
            page.goto(department)
            courses = get_course_links(page)

            for course in courses:
                page.goto(course)
                course_prereqs[course_code(course)] = get_prereq_codes(page)

        browser.close()

        return course_prereqs
    
if __name__ == "__main__":
    prereqs = prereq_dict()
    print(json.dumps(prereqs, indent=2))