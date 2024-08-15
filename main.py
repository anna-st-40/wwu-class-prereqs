from playwright.sync_api import sync_playwright
import json

def get_department_links(page) -> list:
    """
    Extract from the page links to all the departments
    """
    departments = page.query_selector_all('.sc-child-item-links li a')
    department_links = ["https://wallawalla.smartcatalogiq.com" + d.get_attribute('href') for d in departments]
    return department_links

def get_course_links(page) -> list:
    """
    Extract from the page links to all the courses
    """
    courses = page.query_selector_all('.sc-child-item-links li a')
    course_links = ["https://wallawalla.smartcatalogiq.com" + c.get_attribute('href') for c in courses]
    return course_links

def get_prereq_codes(page) -> list:
    """
    Extract the codes of all prerequisites on that class page
    """
    if page.query_selector('h3:has-text("Prerequisite")'):
        prereqs = page.query_selector_all(".sc_prereqs a")
        return [e.inner_html() for e in prereqs]

def get_coreq_codes(page) -> list:
    """
    Extract the codes of all corequisites on that class page
    """
    if page.query_selector('h3:has-text("Corequisite")'):
        coreqs = page.query_selector_all(".sc_coreqs a")
        return [e.inner_html() for e in coreqs]

def course_code(url) -> str:
    """
    Extract the course code from the URL
    """
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
        # departments = departments[:2] #FOR TESTING

        for department in departments:
            page.goto(department)
            courses = get_course_links(page)

            for course in courses:
                page.goto(course)
                course_prereqs[course_code(course)] = get_prereq_codes(page)

        browser.close()

        return course_prereqs

def coreq_dict() -> dict:
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
        course_coreqs = {}

        departments = get_department_links(page)

        for department in departments:
            page.goto(department)
            courses = get_course_links(page)

            for course in courses:
                page.goto(course)
                course_coreqs[course_code(course)] = get_coreq_codes(page)

        browser.close()

        return course_coreqs

def prereq_edges(prereq_dict:dict, text_file):
    """
    Writes a text file of the edges of the graph.
    """
    with open(text_file, "w") as file:
        for k, v in prereq_dict.items():
            if v:
                for prereq in v:
                    file.write(prereq.replace(' ', '')+' '+k.replace(' ', '')+'\n')

def compile_data(prereq_dict, coreq_dict):
    """
    Compiles the data from the two dictionaries into a single dictionary for website use.
    """

    comp_dict = {"courses": []}
    for k, v in prereq_dict.items():
        comp_dict["courses"].append(
            {
                "id": k, 
                "prerequisites": v if v else [], 
                "corequisites": coreq_dict[k] if coreq_dict[k] else [],
                }
        )
        
    return comp_dict

if __name__ == "__main__":
    # coreqs = json.load(open('data/coreq_dict.json'))
    # prereqs = json.load(open('data/prereq_dict.json'))
    # data = compile_data(prereqs, coreqs)


    # with open("data/data_dict.json", "w") as f:
    #     f.write(json.dumps(data, indent=4))
    
    # print("Done!")

    # coreqs = coreq_dict()

    # with open("data/coreq_dict.json", "w") as file:
    #     file.write(json.dumps(coreqs, indent=4))
    
    # print("Done!")
    pass
