import networkx as nx
import matplotlib.pyplot as plt

g = nx.DiGraph()

g.add_edge("hello", 2)
g.add_edge(2, 3)
g.add_edge(3, 4)
g.add_edge(1, 3)
g.add_edge(1, 5)

nx.draw(g, with_labels = True, )
plt.savefig("test.png")
