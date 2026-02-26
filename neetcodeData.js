// NeetCode 150 - Coding Interview Problem Roadmap
// 15 categories, 150 problems total

const NeetCodeData = {
  categories: [
    {
      id: 'arrays-hashing',
      name: 'Arrays & Hashing',
      icon: '📦',
      description: 'Foundation of most coding problems. Master hash maps and array manipulation.',
      problems: [
        { id: 1, name: 'Contains Duplicate', difficulty: 'Easy', leetcode: 217, pattern: 'Hash Set' },
        { id: 2, name: 'Valid Anagram', difficulty: 'Easy', leetcode: 242, pattern: 'Hash Map' },
        { id: 3, name: 'Two Sum', difficulty: 'Easy', leetcode: 1, pattern: 'Hash Map' },
        { id: 4, name: 'Group Anagrams', difficulty: 'Medium', leetcode: 49, pattern: 'Hash Map' },
        { id: 5, name: 'Top K Frequent Elements', difficulty: 'Medium', leetcode: 347, pattern: 'Bucket Sort' },
        { id: 6, name: 'Product of Array Except Self', difficulty: 'Medium', leetcode: 238, pattern: 'Prefix/Suffix' },
        { id: 7, name: 'Valid Sudoku', difficulty: 'Medium', leetcode: 36, pattern: 'Hash Set' },
        { id: 8, name: 'Encode and Decode Strings', difficulty: 'Medium', leetcode: 271, pattern: 'Encoding' },
        { id: 9, name: 'Longest Consecutive Sequence', difficulty: 'Medium', leetcode: 128, pattern: 'Hash Set' }
      ]
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      icon: '👆👆',
      description: 'Use two pointers from opposite ends or different speeds to solve array problems efficiently.',
      problems: [
        { id: 10, name: 'Valid Palindrome', difficulty: 'Easy', leetcode: 125, pattern: 'Left/Right' },
        { id: 11, name: 'Two Sum II', difficulty: 'Medium', leetcode: 167, pattern: 'Left/Right' },
        { id: 12, name: '3Sum', difficulty: 'Medium', leetcode: 15, pattern: 'Sort + Two Pointers' },
        { id: 13, name: 'Container With Most Water', difficulty: 'Medium', leetcode: 11, pattern: 'Left/Right' },
        { id: 14, name: 'Trapping Rain Water', difficulty: 'Hard', leetcode: 42, pattern: 'Left/Right Max' }
      ]
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      icon: '🪟',
      description: 'Maintain a window of elements and slide it to find optimal subarray/substring.',
      problems: [
        { id: 15, name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcode: 121, pattern: 'Min So Far' },
        { id: 16, name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcode: 3, pattern: 'Variable Window' },
        { id: 17, name: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcode: 424, pattern: 'Variable Window' },
        { id: 18, name: 'Permutation in String', difficulty: 'Medium', leetcode: 567, pattern: 'Fixed Window' },
        { id: 19, name: 'Minimum Window Substring', difficulty: 'Hard', leetcode: 76, pattern: 'Variable Window' },
        { id: 20, name: 'Sliding Window Maximum', difficulty: 'Hard', leetcode: 239, pattern: 'Monotonic Deque' }
      ]
    },
    {
      id: 'stack',
      name: 'Stack',
      icon: '📚',
      description: 'LIFO structure for matching pairs, parsing expressions, and monotonic problems.',
      problems: [
        { id: 21, name: 'Valid Parentheses', difficulty: 'Easy', leetcode: 20, pattern: 'Matching' },
        { id: 22, name: 'Min Stack', difficulty: 'Medium', leetcode: 155, pattern: 'Two Stacks' },
        { id: 23, name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcode: 150, pattern: 'Operand Stack' },
        { id: 24, name: 'Generate Parentheses', difficulty: 'Medium', leetcode: 22, pattern: 'Backtracking' },
        { id: 25, name: 'Daily Temperatures', difficulty: 'Medium', leetcode: 739, pattern: 'Monotonic Stack' },
        { id: 26, name: 'Car Fleet', difficulty: 'Medium', leetcode: 853, pattern: 'Monotonic Stack' },
        { id: 27, name: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcode: 84, pattern: 'Monotonic Stack' }
      ]
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      icon: '🔍',
      description: 'O(log n) search in sorted arrays. Key: identify the search space.',
      problems: [
        { id: 28, name: 'Binary Search', difficulty: 'Easy', leetcode: 704, pattern: 'Classic' },
        { id: 29, name: 'Search a 2D Matrix', difficulty: 'Medium', leetcode: 74, pattern: 'Flatten' },
        { id: 30, name: 'Koko Eating Bananas', difficulty: 'Medium', leetcode: 875, pattern: 'Search on Answer' },
        { id: 31, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcode: 153, pattern: 'Rotated Array' },
        { id: 32, name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcode: 33, pattern: 'Rotated Array' },
        { id: 33, name: 'Time Based Key-Value Store', difficulty: 'Medium', leetcode: 981, pattern: 'Upper Bound' },
        { id: 34, name: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcode: 4, pattern: 'Partition' }
      ]
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      icon: '🔗',
      description: 'Pointer manipulation, fast/slow technique, and reversal patterns.',
      problems: [
        { id: 35, name: 'Reverse Linked List', difficulty: 'Easy', leetcode: 206, pattern: 'Iterative/Recursive' },
        { id: 36, name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcode: 21, pattern: 'Merge' },
        { id: 37, name: 'Reorder List', difficulty: 'Medium', leetcode: 143, pattern: 'Find Mid + Reverse + Merge' },
        { id: 38, name: 'Remove Nth Node From End', difficulty: 'Medium', leetcode: 19, pattern: 'Two Pointers' },
        { id: 39, name: 'Copy List with Random Pointer', difficulty: 'Medium', leetcode: 138, pattern: 'Hash Map' },
        { id: 40, name: 'Add Two Numbers', difficulty: 'Medium', leetcode: 2, pattern: 'Carry' },
        { id: 41, name: 'Linked List Cycle', difficulty: 'Easy', leetcode: 141, pattern: 'Fast/Slow' },
        { id: 42, name: 'Find the Duplicate Number', difficulty: 'Medium', leetcode: 287, pattern: 'Cycle Detection' },
        { id: 43, name: 'LRU Cache', difficulty: 'Medium', leetcode: 146, pattern: 'Hash + Doubly Linked' },
        { id: 44, name: 'Merge k Sorted Lists', difficulty: 'Hard', leetcode: 23, pattern: 'Heap/Divide Conquer' },
        { id: 45, name: 'Reverse Nodes in k-Group', difficulty: 'Hard', leetcode: 25, pattern: 'Group Reverse' }
      ]
    },
    {
      id: 'trees',
      name: 'Trees',
      icon: '🌳',
      description: 'Binary trees, BST properties, and tree traversal patterns.',
      problems: [
        { id: 46, name: 'Invert Binary Tree', difficulty: 'Easy', leetcode: 226, pattern: 'DFS' },
        { id: 47, name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcode: 104, pattern: 'DFS' },
        { id: 48, name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcode: 543, pattern: 'DFS + Global Max' },
        { id: 49, name: 'Balanced Binary Tree', difficulty: 'Easy', leetcode: 110, pattern: 'DFS' },
        { id: 50, name: 'Same Tree', difficulty: 'Easy', leetcode: 100, pattern: 'DFS' },
        { id: 51, name: 'Subtree of Another Tree', difficulty: 'Easy', leetcode: 572, pattern: 'DFS + Same Tree' },
        { id: 52, name: 'Lowest Common Ancestor of BST', difficulty: 'Medium', leetcode: 235, pattern: 'BST Property' },
        { id: 53, name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', leetcode: 102, pattern: 'BFS' },
        { id: 54, name: 'Binary Tree Right Side View', difficulty: 'Medium', leetcode: 199, pattern: 'BFS/DFS' },
        { id: 55, name: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', leetcode: 1448, pattern: 'DFS + Max Path' },
        { id: 56, name: 'Validate Binary Search Tree', difficulty: 'Medium', leetcode: 98, pattern: 'DFS + Range' },
        { id: 57, name: 'Kth Smallest Element in BST', difficulty: 'Medium', leetcode: 230, pattern: 'Inorder' },
        { id: 58, name: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', leetcode: 105, pattern: 'Recursion' },
        { id: 59, name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcode: 124, pattern: 'DFS + Global Max' },
        { id: 60, name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcode: 297, pattern: 'BFS/DFS' }
      ]
    },
    {
      id: 'tries',
      name: 'Tries',
      icon: '🔤',
      description: 'Prefix tree for efficient string operations and word search.',
      problems: [
        { id: 61, name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcode: 208, pattern: 'Basic Trie' },
        { id: 62, name: 'Design Add and Search Words', difficulty: 'Medium', leetcode: 211, pattern: 'Trie + DFS' },
        { id: 63, name: 'Word Search II', difficulty: 'Hard', leetcode: 212, pattern: 'Trie + Backtracking' }
      ]
    },
    {
      id: 'heap',
      name: 'Heap / Priority Queue',
      icon: '⛰️',
      description: 'Efficiently find min/max elements. Key for top-k and streaming problems.',
      problems: [
        { id: 64, name: 'Kth Largest Element in Stream', difficulty: 'Easy', leetcode: 703, pattern: 'Min Heap' },
        { id: 65, name: 'Last Stone Weight', difficulty: 'Easy', leetcode: 1046, pattern: 'Max Heap' },
        { id: 66, name: 'K Closest Points to Origin', difficulty: 'Medium', leetcode: 973, pattern: 'Max Heap' },
        { id: 67, name: 'Kth Largest Element in Array', difficulty: 'Medium', leetcode: 215, pattern: 'Quick Select/Heap' },
        { id: 68, name: 'Task Scheduler', difficulty: 'Medium', leetcode: 621, pattern: 'Max Heap + Greedy' },
        { id: 69, name: 'Design Twitter', difficulty: 'Medium', leetcode: 355, pattern: 'Heap + Hash Map' },
        { id: 70, name: 'Find Median from Data Stream', difficulty: 'Hard', leetcode: 295, pattern: 'Two Heaps' }
      ]
    },
    {
      id: 'backtracking',
      name: 'Backtracking',
      icon: '🔙',
      description: 'Explore all possibilities with pruning. Key for permutations, combinations, subsets.',
      problems: [
        { id: 71, name: 'Subsets', difficulty: 'Medium', leetcode: 78, pattern: 'Include/Exclude' },
        { id: 72, name: 'Combination Sum', difficulty: 'Medium', leetcode: 39, pattern: 'Unlimited Reuse' },
        { id: 73, name: 'Permutations', difficulty: 'Medium', leetcode: 46, pattern: 'Swap' },
        { id: 74, name: 'Subsets II', difficulty: 'Medium', leetcode: 90, pattern: 'Skip Duplicates' },
        { id: 75, name: 'Combination Sum II', difficulty: 'Medium', leetcode: 40, pattern: 'Skip Duplicates' },
        { id: 76, name: 'Word Search', difficulty: 'Medium', leetcode: 79, pattern: 'Grid DFS' },
        { id: 77, name: 'Palindrome Partitioning', difficulty: 'Medium', leetcode: 131, pattern: 'Partition' },
        { id: 78, name: 'Letter Combinations of Phone Number', difficulty: 'Medium', leetcode: 17, pattern: 'Mapping' },
        { id: 79, name: 'N-Queens', difficulty: 'Hard', leetcode: 51, pattern: 'Column/Diagonal Check' }
      ]
    },
    {
      id: 'graphs',
      name: 'Graphs',
      icon: '🕸️',
      description: 'DFS, BFS, Union-Find, and topological sort patterns.',
      problems: [
        { id: 80, name: 'Number of Islands', difficulty: 'Medium', leetcode: 200, pattern: 'Grid DFS/BFS' },
        { id: 81, name: 'Clone Graph', difficulty: 'Medium', leetcode: 133, pattern: 'DFS + Hash Map' },
        { id: 82, name: 'Max Area of Island', difficulty: 'Medium', leetcode: 695, pattern: 'Grid DFS' },
        { id: 83, name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcode: 417, pattern: 'Multi-source BFS' },
        { id: 84, name: 'Surrounded Regions', difficulty: 'Medium', leetcode: 130, pattern: 'Border DFS' },
        { id: 85, name: 'Rotting Oranges', difficulty: 'Medium', leetcode: 994, pattern: 'Multi-source BFS' },
        { id: 86, name: 'Walls and Gates', difficulty: 'Medium', leetcode: 286, pattern: 'Multi-source BFS' },
        { id: 87, name: 'Course Schedule', difficulty: 'Medium', leetcode: 207, pattern: 'Topological Sort' },
        { id: 88, name: 'Course Schedule II', difficulty: 'Medium', leetcode: 210, pattern: 'Topological Sort' },
        { id: 89, name: 'Redundant Connection', difficulty: 'Medium', leetcode: 684, pattern: 'Union Find' },
        { id: 90, name: 'Number of Connected Components', difficulty: 'Medium', leetcode: 323, pattern: 'Union Find/DFS' },
        { id: 91, name: 'Graph Valid Tree', difficulty: 'Medium', leetcode: 261, pattern: 'Union Find' },
        { id: 92, name: 'Word Ladder', difficulty: 'Hard', leetcode: 127, pattern: 'BFS' }
      ]
    },
    {
      id: 'dynamic-programming',
      name: 'Dynamic Programming',
      icon: '📊',
      description: 'Break down into overlapping subproblems. Master 1D and 2D DP patterns.',
      problems: [
        { id: 93, name: 'Climbing Stairs', difficulty: 'Easy', leetcode: 70, pattern: '1D DP' },
        { id: 94, name: 'Min Cost Climbing Stairs', difficulty: 'Easy', leetcode: 746, pattern: '1D DP' },
        { id: 95, name: 'House Robber', difficulty: 'Medium', leetcode: 198, pattern: '1D DP' },
        { id: 96, name: 'House Robber II', difficulty: 'Medium', leetcode: 213, pattern: 'Circular DP' },
        { id: 97, name: 'Longest Palindromic Substring', difficulty: 'Medium', leetcode: 5, pattern: '2D DP/Expand' },
        { id: 98, name: 'Palindromic Substrings', difficulty: 'Medium', leetcode: 647, pattern: '2D DP/Expand' },
        { id: 99, name: 'Decode Ways', difficulty: 'Medium', leetcode: 91, pattern: '1D DP' },
        { id: 100, name: 'Coin Change', difficulty: 'Medium', leetcode: 322, pattern: 'Unbounded Knapsack' },
        { id: 101, name: 'Maximum Product Subarray', difficulty: 'Medium', leetcode: 152, pattern: 'Track Min/Max' },
        { id: 102, name: 'Word Break', difficulty: 'Medium', leetcode: 139, pattern: '1D DP + Trie/Set' },
        { id: 103, name: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcode: 300, pattern: '1D DP/Binary Search' },
        { id: 104, name: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcode: 416, pattern: '0/1 Knapsack' },
        { id: 105, name: 'Unique Paths', difficulty: 'Medium', leetcode: 62, pattern: '2D DP' },
        { id: 106, name: 'Longest Common Subsequence', difficulty: 'Medium', leetcode: 1143, pattern: '2D DP' },
        { id: 107, name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', leetcode: 309, pattern: 'State Machine' },
        { id: 108, name: 'Coin Change 2', difficulty: 'Medium', leetcode: 518, pattern: 'Unbounded Knapsack' },
        { id: 109, name: 'Target Sum', difficulty: 'Medium', leetcode: 494, pattern: '0/1 Knapsack' },
        { id: 110, name: 'Interleaving String', difficulty: 'Medium', leetcode: 97, pattern: '2D DP' },
        { id: 111, name: 'Longest Increasing Path in Matrix', difficulty: 'Hard', leetcode: 329, pattern: 'DFS + Memo' },
        { id: 112, name: 'Distinct Subsequences', difficulty: 'Hard', leetcode: 115, pattern: '2D DP' },
        { id: 113, name: 'Edit Distance', difficulty: 'Hard', leetcode: 72, pattern: '2D DP' },
        { id: 114, name: 'Burst Balloons', difficulty: 'Hard', leetcode: 312, pattern: 'Interval DP' },
        { id: 115, name: 'Regular Expression Matching', difficulty: 'Hard', leetcode: 10, pattern: '2D DP' }
      ]
    },
    {
      id: 'greedy',
      name: 'Greedy',
      icon: '🤑',
      description: 'Make locally optimal choices. Prove greedy choice property works.',
      problems: [
        { id: 116, name: 'Maximum Subarray', difficulty: 'Medium', leetcode: 53, pattern: "Kadane's" },
        { id: 117, name: 'Jump Game', difficulty: 'Medium', leetcode: 55, pattern: 'Furthest Reach' },
        { id: 118, name: 'Jump Game II', difficulty: 'Medium', leetcode: 45, pattern: 'BFS/Greedy' },
        { id: 119, name: 'Gas Station', difficulty: 'Medium', leetcode: 134, pattern: 'Circular Array' },
        { id: 120, name: 'Hand of Straights', difficulty: 'Medium', leetcode: 846, pattern: 'Greedy + Hash' },
        { id: 121, name: 'Merge Triplets to Form Target', difficulty: 'Medium', leetcode: 1899, pattern: 'Greedy' },
        { id: 122, name: 'Partition Labels', difficulty: 'Medium', leetcode: 763, pattern: 'Last Index' },
        { id: 123, name: 'Valid Parenthesis String', difficulty: 'Medium', leetcode: 678, pattern: 'Two Pass' }
      ]
    },
    {
      id: 'intervals',
      name: 'Intervals',
      icon: '📅',
      description: 'Sort by start/end, then merge or find overlaps.',
      problems: [
        { id: 124, name: 'Insert Interval', difficulty: 'Medium', leetcode: 57, pattern: 'Merge' },
        { id: 125, name: 'Merge Intervals', difficulty: 'Medium', leetcode: 56, pattern: 'Sort + Merge' },
        { id: 126, name: 'Non-overlapping Intervals', difficulty: 'Medium', leetcode: 435, pattern: 'Greedy' },
        { id: 127, name: 'Meeting Rooms', difficulty: 'Easy', leetcode: 252, pattern: 'Sort' },
        { id: 128, name: 'Meeting Rooms II', difficulty: 'Medium', leetcode: 253, pattern: 'Min Heap' },
        { id: 129, name: 'Minimum Interval to Include Each Query', difficulty: 'Hard', leetcode: 1851, pattern: 'Sort + Heap' }
      ]
    },
    {
      id: 'math-geometry',
      name: 'Math & Geometry',
      icon: '📐',
      description: 'Mathematical properties and geometric algorithms.',
      problems: [
        { id: 130, name: 'Rotate Image', difficulty: 'Medium', leetcode: 48, pattern: 'Transpose + Reverse' },
        { id: 131, name: 'Spiral Matrix', difficulty: 'Medium', leetcode: 54, pattern: 'Simulation' },
        { id: 132, name: 'Set Matrix Zeroes', difficulty: 'Medium', leetcode: 73, pattern: 'In-place Marker' },
        { id: 133, name: 'Happy Number', difficulty: 'Easy', leetcode: 202, pattern: 'Cycle Detection' },
        { id: 134, name: 'Plus One', difficulty: 'Easy', leetcode: 66, pattern: 'Carry' },
        { id: 135, name: 'Pow(x, n)', difficulty: 'Medium', leetcode: 50, pattern: 'Fast Power' },
        { id: 136, name: 'Multiply Strings', difficulty: 'Medium', leetcode: 43, pattern: 'Grade School' },
        { id: 137, name: 'Detect Squares', difficulty: 'Medium', leetcode: 2013, pattern: 'Hash Map' }
      ]
    },
    {
      id: 'bit-manipulation',
      name: 'Bit Manipulation',
      icon: '🔢',
      description: 'XOR, AND, OR, shift operations for efficient solutions.',
      problems: [
        { id: 138, name: 'Single Number', difficulty: 'Easy', leetcode: 136, pattern: 'XOR' },
        { id: 139, name: 'Number of 1 Bits', difficulty: 'Easy', leetcode: 191, pattern: 'Bit Count' },
        { id: 140, name: 'Counting Bits', difficulty: 'Easy', leetcode: 338, pattern: 'DP + Bit' },
        { id: 141, name: 'Reverse Bits', difficulty: 'Easy', leetcode: 190, pattern: 'Bit Shift' },
        { id: 142, name: 'Missing Number', difficulty: 'Easy', leetcode: 268, pattern: 'XOR / Math' },
        { id: 143, name: 'Sum of Two Integers', difficulty: 'Medium', leetcode: 371, pattern: 'Bit Add' },
        { id: 144, name: 'Reverse Integer', difficulty: 'Medium', leetcode: 7, pattern: 'Overflow Check' }
      ]
    }
  ],
  
  // Pattern explanations
  patterns: {
    'Hash Map': 'Store key-value pairs for O(1) lookup. Great for counting and grouping.',
    'Hash Set': 'Store unique elements for O(1) membership check.',
    'Two Pointers': 'Use two pointers moving towards each other or at different speeds.',
    'Sliding Window': 'Maintain a window and slide it over array to find optimal subarray.',
    'Binary Search': 'Halve search space each iteration. O(log n) time.',
    'DFS': 'Depth-First Search - explore as far as possible before backtracking.',
    'BFS': 'Breadth-First Search - explore level by level. Good for shortest path.',
    'Monotonic Stack': 'Stack that maintains increasing/decreasing order. For next greater/smaller.',
    'Union Find': 'Disjoint set data structure for connectivity problems.',
    'Topological Sort': 'Order vertices in DAG such that all edges point forward.',
    '1D DP': 'State depends on previous 1-2 states. Use array.',
    '2D DP': 'State depends on row and column. Use matrix.',
    'Backtracking': 'Try all possibilities, undo and try next. Pruning for efficiency.',
    'Greedy': 'Make locally optimal choice at each step. Prove it leads to global optimum.'
  },
  
  // Study tips
  tips: [
    { title: 'Pattern Recognition', content: 'Focus on recognizing patterns, not memorizing solutions. Each category has 2-3 key patterns.' },
    { title: 'Time Complexity First', content: "Before coding, state the expected time complexity. It guides your approach." },
    { title: 'Start with Easy', content: 'Master easy problems in each category before moving to medium/hard.' },
    { title: 'Spaced Repetition', content: 'Review solved problems after 1 day, 3 days, 1 week. Retention > volume.' },
    { title: 'Mock Interviews', content: 'Practice explaining your thought process out loud. Communication matters.' }
  ]
};

// Stats
NeetCodeData.stats = {
  total: 144,
  easy: NeetCodeData.categories.flatMap(c => c.problems).filter(p => p.difficulty === 'Easy').length,
  medium: NeetCodeData.categories.flatMap(c => c.problems).filter(p => p.difficulty === 'Medium').length,
  hard: NeetCodeData.categories.flatMap(c => c.problems).filter(p => p.difficulty === 'Hard').length,
  categories: NeetCodeData.categories.length
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NeetCodeData };
}
