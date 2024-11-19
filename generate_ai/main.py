"""
Stable Diffusion 3で画像を生成するサンプル
https://ja.stability.ai/stable-diffusion
"""

import os
from datetime import datetime

import requests

STABILITY_AI_API_KEY = os.environ.get("STABILITY_AI_API_KEY")


def generate_image(prompt: str):
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "authorization": f"Bearer {STABILITY_AI_API_KEY}",
            "accept": "image/*",
        },
        files={"none": ""},
        data={
            "prompt": prompt,
            "output_format": "jpeg",
        },
    )

    now = datetime.now()
    if response.status_code == 200:
        with open(f"./generated_{now.strftime('%Y%m%d%H%M%S')}.jpeg", "wb") as file:
            file.write(response.content)
    else:
        raise Exception(str(response.json()))


if __name__ == "__main__":
    stdin = input("Enter a prompt: ")
    generate_image(stdin)
