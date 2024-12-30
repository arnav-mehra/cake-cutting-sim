from enum import Enum
from collections import Counter
from z3 import *

if __name__ == '__main__':
    solver = Optimize()

    n = Int('n')
    solver.add(n == 10)

    k = Int('k')
    solver.add(k >= n * n)

    ep = Real('ep')
    solver.add(ep > 0)

    piece_lower = 1 / (k * n) - ep
    solver.add(piece_lower > 0)

    piece_upper = 1 / (k * n) + ep

    pieces = ToInt((1 / n) / (piece_upper * 2))
    min_val = 1 / (n * (n - 1))
    solver.add(pieces * piece_lower >= min_val)

    queries = k * k / ep
    solver.minimize(queries)

    print(solver.check())
    print(solver.model())