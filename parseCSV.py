import pandas as pd
def main():
    readCSVFile()

def readCSVFile():
    dataFrame = pd.read_csv('Example Columns  - Sheet1.csv')
    print(dataFrame)

if __name__ == "__main__":
    main()
