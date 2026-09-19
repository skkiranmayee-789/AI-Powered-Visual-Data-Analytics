from module5.workflow import build_investigation_workflow


def main():

    print("\n=== Vision Desk - Module 5 ===")
    print("Agentic Workplace Investigation\n")

    query = input("Enter investigation request: ")

    workflow = build_investigation_workflow()

    result = workflow.invoke({
        "query": query
    })

    print("\n" + "=" * 60)
    print("INVESTIGATION REPORT")
    print("=" * 60)

    print(result.get("report", "No report generated."))

    print("\n" + "=" * 60)
    print("Investigation completed.")
    print("=" * 60)


if __name__ == "__main__":
    main()