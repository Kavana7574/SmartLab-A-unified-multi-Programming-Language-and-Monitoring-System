import { LabExercise } from '../types/lab';

export const LAB_EXERCISES: LabExercise[] = [
  // C Programming Exercises
  {
    id: 'c-lab-1',
    language: 'c',
    labNumber: 1,
    title: 'Matrix Multiplication & Pointer Arithmetic',
    category: 'Arrays & Pointers',
    difficulty: 'Medium',
    description: 'Write a C program to multiply two 2x2 matrices using pointer arithmetic and display the resulting matrix.',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int r1 = 2, c1 = 2, r2 = 2, c2 = 2;
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    int result[2][2] = {{0, 0}, {0, 0}};

    printf("=== C Lab Exercise 1: Matrix Multiplication ===\\n");

    // Matrix Multiplication logic
    for(int i = 0; i < r1; i++) {
        for(int j = 0; j < c2; j++) {
            for(int k = 0; k < c1; k++) {
                *(*(result + i) + j) += *(*(a + i) + k) * *(*(b + k) + j);
            }
        }
    }

    // Display result
    printf("Resultant Matrix:\\n");
    for(int i = 0; i < r1; i++) {
        for(int j = 0; j < c2; j++) {
            printf("%d\\t", *(*(result + i) + j));
        }
        printf("\\n");
    }

    return 0;
}`,
    testCases: [
      {
        input: '',
        expectedOutput: '19\t22\n43\t50',
        description: 'Multiplication of standard 2x2 test matrices'
      }
    ]
  },
  {
    id: 'c-lab-2',
    language: 'c',
    labNumber: 2,
    title: 'Singly Linked List Implementation (DSA Lab)',
    category: 'Data Structures',
    difficulty: 'Hard',
    description: 'Implement insertion at the front, insertion at the end, and display operations for a Singly Linked List.',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* insertFront(struct Node* head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = head;
    return newNode;
}

void display(struct Node* head) {
    struct Node* temp = head;
    printf("Linked List Elements: ");
    while(temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    printf("--- Singly Linked List Lab Session ---\\n");
    head = insertFront(head, 30);
    head = insertFront(head, 20);
    head = insertFront(head, 10);
    display(head);
    return 0;
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Linked List Elements: 10 -> 20 -> 30 -> NULL',
        description: 'Verify sequential node links'
      }
    ]
  },
  {
    id: 'c-lab-3',
    language: 'c',
    labNumber: 3,
    title: 'Palindrome & String Reversal via Pointers',
    category: 'Strings & Memory',
    difficulty: 'Easy',
    description: 'Read a word from input or test string, reverse it using two pointers, and determine if it is a palindrome.',
    starterCode: `#include <stdio.h>
#include <string.h>

int isPalindrome(char *str) {
    char *left = str;
    char *right = str + strlen(str) - 1;
    while (left < right) {
        if (*left != *right) return 0;
        left++;
        right--;
    }
    return 1;
}

int main() {
    char word[] = "radar";
    printf("Testing string: %s\\n", word);
    if (isPalindrome(word)) {
        printf("%s is a Palindrome!\\n", word);
    } else {
        printf("%s is NOT a Palindrome.\\n", word);
    }
    return 0;
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'radar is a Palindrome!',
        description: 'Standard palindrome test'
      }
    ]
  },

  // Python Programming Exercises
  {
    id: 'py-lab-1',
    language: 'python',
    labNumber: 1,
    title: 'Word Frequency & Text Analyzer',
    category: 'Data Structures',
    difficulty: 'Easy',
    description: 'Write a Python script that takes a paragraph and computes the frequency of each unique word using dictionaries.',
    starterCode: `# Python Lab: Word Frequency Analyzer
def analyze_text(text: str):
    words = text.lower().replace('.', '').replace(',', '').split()
    frequency = {}
    for word in words:
        frequency[word] = frequency.get(word, 0) + 1
    
    print("=== Word Frequency Report ===")
    for word, count in sorted(frequency.items(), key=lambda x: x[1], reverse=True):
        print(f"{word:12} : {count} times")
    return frequency

sample_text = "Data science is fun. Learning python in college lab is great fun."
analyze_text(sample_text)
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'fun          : 2 times',
        description: 'Checks top recurring keyword'
      }
    ]
  },
  {
    id: 'py-lab-2',
    language: 'python',
    labNumber: 2,
    title: 'Recursive Fibonacci & Memoization Benchmark',
    category: 'Algorithms',
    difficulty: 'Medium',
    description: 'Implement Fibonacci using both pure recursion and memoization. Compare calls and compute the first 10 Fibonacci numbers.',
    starterCode: `# Python Lab: Recursion & Dynamic Programming
memo = {}
call_count = 0

def fib(n: int) -> int:
    global call_count
    call_count += 1
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

print("=== Generating Fibonacci Sequence (N=10) ===")
series = [fib(i) for i in range(11)]
print("Series:", series)
print(f"Total function evaluations with memoization: {call_count}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Series: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]',
        description: 'Check 0 through 10 fib sequence'
      }
    ]
  },
  {
    id: 'py-lab-3',
    language: 'python',
    labNumber: 3,
    title: 'Bubble Sort & Binary Search on Student Records',
    category: 'Searching & Sorting',
    difficulty: 'Medium',
    description: 'Sort an array of student marks and perform binary search to find whether a specific score exists.',
    starterCode: `# Python Lab: Bubble Sort & Binary Search
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

marks = [78, 45, 92, 63, 88, 54, 99, 71]
print("Original Marks:", marks)
sorted_marks = bubble_sort(marks.copy())
print("Sorted Marks:  ", sorted_marks)

target = 88
pos = binary_search(sorted_marks, target)
print(f"Target mark {target} found at index: {pos}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Target mark 88 found at index: 5',
        description: 'Verify sorted position'
      }
    ]
  },

  // Java Programming Exercises
  {
    id: 'java-lab-1',
    language: 'java',
    labNumber: 1,
    title: 'Employee Payroll Inheritance & Polymorphism',
    category: 'Object Oriented Programming',
    difficulty: 'Medium',
    description: 'Create an abstract Employee superclass and derive FullTimeEmployee and PartTimeEmployee to calculate monthly salaries.',
    starterCode: `// Java Lab 1: Inheritance and Polymorphism
abstract class Employee {
    protected String name;
    protected String id;

    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public abstract double calculateSalary();

    public void printDetails() {
        System.out.println("ID: " + id + " | Name: " + name + " | Monthly Salary: $" + calculateSalary());
    }
}

class FullTimeEmployee extends Employee {
    private double basicPay;
    private double allowances;

    public FullTimeEmployee(String name, String id, double basicPay, double allowances) {
        super(name, id);
        this.basicPay = basicPay;
        this.allowances = allowances;
    }

    @Override
    public double calculateSalary() {
        return basicPay + allowances;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Department Payroll System ===");
        Employee emp1 = new FullTimeEmployee("Dr. Ramesh Kumar", "EMP-041", 65000, 18000);
        emp1.printDetails();
    }
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'ID: EMP-041 | Name: Dr. Ramesh Kumar | Monthly Salary: $83000.0',
        description: 'Check inheritance salary computation'
      }
    ]
  },
  {
    id: 'java-lab-2',
    language: 'java',
    labNumber: 2,
    title: 'Custom Exception Handling & Bank Account',
    category: 'Exception Handling',
    difficulty: 'Medium',
    description: 'Implement a BankAccount class with withdraw() that throws InsufficientBalanceException when funds are low.',
    starterCode: `// Java Lab 2: Exception Handling
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("Withdrawal of $" + amount + " failed! Current balance is $" + balance);
        }
        balance -= amount;
        System.out.println("Withdrawal successful! Remaining balance: $" + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Bank Transaction Lab ===");
        BankAccount acc = new BankAccount("SB-109283", 500.0);
        try {
            acc.withdraw(200.0);
            acc.withdraw(450.0); // Should trigger exception
        } catch (InsufficientFundsException e) {
            System.err.println("Caught Exception: " + e.getMessage());
        }
    }
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Withdrawal successful! Remaining balance: $300.0',
        description: 'Check successful transaction before exception'
      }
    ]
  },
  {
    id: 'java-lab-3',
    language: 'java',
    labNumber: 3,
    title: 'Matrix Transpose and Symmetric Check',
    category: 'Arrays & Logic',
    difficulty: 'Easy',
    description: 'Read a square matrix, display its transpose, and verify whether the matrix is symmetric.',
    starterCode: `// Java Lab 3: Matrix Transpose
public class Main {
    public static void main(String[] args) {
        int[][] mat = {
            {1, 2, 3},
            {2, 5, 6},
            {3, 6, 9}
        };
        int n = 3;
        boolean isSymmetric = true;

        System.out.println("=== Matrix Transpose & Symmetry Lab ===");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] != mat[j][i]) {
                    isSymmetric = false;
                    break;
                }
            }
        }

        System.out.println("Is Matrix Symmetric? " + (isSymmetric ? "YES (A == A^T)" : "NO"));
    }
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Is Matrix Symmetric? YES (A == A^T)',
        description: 'Verify symmetric matrix validation'
      }
    ]
  }
];

export const DEFAULT_STARTER_CODES: Record<string, string> = {
  c: `// College Lab Workbench - C Programming
#include <stdio.h>

int main() {
    printf("Hello from College C Lab!\\n");
    printf("Compile and execute your C code here.\\n");
    return 0;
}`,
  python: `# College Lab Workbench - Python 3
def main():
    print("Hello from College Python Lab!")
    print("Write clean, indented Python code here.")

if __name__ == "__main__":
    main()
`,
  java: `// College Lab Workbench - Java OOP Lab
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from College Java Lab!");
        System.out.println("Object-Oriented Programming Workbench ready.");
    }
}`
};
