from playwright.sync_api import sync_playwright, Playwright

class ClassNode():
    def __init__(self, name : str):
        self.name = name
    
    def __repr__(self):
        return self.name


class PrereqGraph():
    def __init__(self, classes : list):
        self.classes = classes

    def add_class(self, class_name):
        self.classes.append(ClassNode(class_name))

dicionary = {
    "Course Name" : {
        "Prereqs" : [
            1,
            2
        ],
        "Children" : [
            1,
            2
        ]
    }
}

classNames = []

classes = [ClassNode(i) for i in classNames]

wallawalla = PrereqGraph(classes)