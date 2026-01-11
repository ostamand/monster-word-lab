import argparse
import os
import requests
import subprocess
import uuid
import json

from dotenv import load_dotenv

USER_ID = "admin"
APP_NAME = "monster_word_agent"


def get_cloud_token():
    try:
        token = subprocess.check_output(
            ["gcloud", "auth", "print-identity-token"], text=True
        ).strip()
        return token
    except Exception as ex:
        print(ex)
        return None


def main(endpoint: str):
    token = get_cloud_token()

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # list available apps
    # curl -X GET -H "Authorization: Bearer $TOKEN" $APP_URL/list-apps
    response = requests.get(f"{endpoint}/list-apps", headers=headers)
    response.raise_for_status()
    print("Apps:", response.json())

    # create a session
    session_id = str(uuid.uuid4())
    response = requests.post(
        f"{endpoint}/apps/{APP_NAME}/users/{USER_ID}/sessions/{session_id}",
        headers=headers,
    )
    response.raise_for_status()
    print("Session:", response.json())

    # run the agent

    user_request = {
        "age": 6,
        "language": "fr",
        "theme": None,
        "targetWord": None,
    }

    payload = {
        "app_name": APP_NAME,
        "user_id": USER_ID,
        "session_id": session_id,
        "new_message": {
            "role": "user",
            "parts": [{"text": json.dumps(user_request)}],
        },
        "streaming": False,
    }
    response = requests.post(f"{endpoint}/run", headers=headers, json=payload)
    response.raise_for_status()

    print("Assets generated successfully.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--endpoint", type=str, required=True)

    args = parser.parse_args()

    load_dotenv()

    main(args.endpoint)