import networkx as nx
import matplotlib.pyplot as plt
from main import *

graph = nx.DiGraph()

dictionary = prereq_dict()
# dictionary = {
#     "ACCT 201": None,
#     "ACCT 202": ["ACCT 201"],
#     "ACCT 203": ["ACCT 201"],
#     "ACCT 235": None,
#     "ACCT 321": ["ACCT 202"],
#     "ACCT 322": ["ACCT 202"],
#     "ACCT 323": ["ACCT 202"],
#     "ACCT 331": ["ACCT 203"],
#     "ACCT 335": None,
#     "ACCT 341": ["ACCT 201"],
#     "ACCT 350": ["ACCT 202"],
#     "ACCT 421": ["ACCT 322"],
#     "ACCT 430": ["ACCT 323"],
#     "ACCT 435": ["ACCT 335"],
#     "ACCT 490": None,
#     "ANTH 225": None
# }

for key in dictionary:
    # graph.add_node(key)
    if dictionary[key]:
        for prereq in dictionary[key]:
            graph.add_edge(prereq, key)

# pos = nx.shell_layout(graph, nlist=None, rotate=None, scale=1)
pos = nx.planar_layout(graph, scale=1, center=None)
nx.draw(graph, pos, with_labels=True, node_size=700, font_size=6)
plt.show()