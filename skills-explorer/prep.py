"""Downloads the public job-skill-set data (CC BY-SA 4.0) and keeps only job title, category and skill list.
Job descriptions are left out on purpose: they are scraped job-ad text, and the demo doesn't need them."""
import ast, json
import pandas as pd
from huggingface_hub import hf_hub_download, list_repo_files

REPO = "batuhanmtl/job-skill-set"


def skills(v):
    """The skill column is a list, or a string like "['Python', 'SQL']"."""
    if isinstance(v, str):
        try:
            v = ast.literal_eval(v)
        except (ValueError, SyntaxError):
            v = v.split(",")
    return sorted({s.strip() for s in v if isinstance(s, str) and s.strip()}, key=str.lower)


if __name__ == "__main__":
    files = [f for f in list_repo_files(REPO, repo_type="dataset") if f.endswith((".csv", ".parquet"))]
    print("files:", files)
    path = hf_hub_download(REPO, files[0], repo_type="dataset")
    df = pd.read_parquet(path) if path.endswith(".parquet") else pd.read_csv(path)
    print("columns:", list(df.columns), "rows:", len(df))
    jobs = [{"t": r.job_title.strip(), "c": r.category, "s": skills(r.job_skill_set)} for r in df.itertuples()]
    jobs = [j for j in jobs if j["t"] and j["s"]]
    # Merge spelling variants ("SQL", "sql") into the most common spelling.
    from collections import Counter
    forms = Counter(s for j in jobs for s in j["s"])
    best = {}
    for s, n in forms.most_common():
        best.setdefault(s.lower(), s)
    for j in jobs:
        j["s"] = sorted({best[s.lower()] for s in j["s"]}, key=str.lower)
    json.dump(jobs, open("jobs.json", "w"))
    print(len(jobs), "jobs,", len({s for j in jobs for s in j["s"]}), "distinct skills,", "categories:", df.category.value_counts().to_dict())
