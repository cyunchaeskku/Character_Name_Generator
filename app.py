import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS 적용

# OpenAI 클라이언트 초기화
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY가 .env 파일에 설정되지 않았습니다.")
client = OpenAI(api_key=api_key)

@app.route('/api/search-word', methods=['POST'])
def search_word():
    data = request.json
    word = data.get('word')
    if not word:
        return jsonify({'error': '검색할 단어가 필요합니다.'}), 400

    try:
        system_prompt = """
        당신은 한국어 단어에 대한 깊은 지식을 가진 유능한 사전 편집자입니다. 사용자가 요청한 단어에 대한 정보를 JSON 형식으로 제공해야 합니다.
        - 'definition' (정의): 단어의 핵심적인 의미를 간결하고 명확하게 설명합니다.
        - 'synonyms' (유의어): 단어와 뜻이 비슷한 유의어를 최대 5개까지 배열 형태로 제공합니다.
        - 'related_words' (관련 단어): 단어와 개념적으로 연관된 단어를 10개 내외로 배열 형태로 제공합니다.
        - 'famous_quote' (유명 문장): 단어가 사용된 가장 유명한 문장 하나를 객체 형태로 제공합니다. 이 객체는 'quote', 'book', 'author' 필드를 포함해야 합니다.
        모든 결과는 한국어로 제공해야 합니다. 정보를 찾을 수 없으면 해당 필드를 null로 설정합니다.
        """
        
        user_prompt = f"'{word}'라는 단어에 대한 정보를 JSON 형식으로 정리해줘."

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )

        ai_response = json.loads(response.choices[0].message.content)
        return jsonify(ai_response)

    except Exception as e:
        print(f"An error occurred during word search: {e}")
        return jsonify({'error': '단어 정보를 처리하는 중 오류가 발생했습니다.'}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    """캐릭터 이름 생성을 처리합니다."""
    try:
        data = request.json
        year = data.get('year')
        background = data.get('background')
        personality = data.get('personality')
        gender = data.get('gender')
        age = data.get('age')
        situation = data.get('situation')

        if not all([year, background, personality, gender, age, situation]):
            return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

        prompt = f"""
        다음 여섯 가지 정보를 바탕으로 소설 등장인물의 이름 5개를 생성해줘:
        1. 작품 년도: {year}
        2. 작품 배경: {background}
        3. 인물 성격: {personality}
        4. 인물 성별: {gender}
        5. 나이: {age}
        6. 처한 상황: {situation}
        규칙:
        - 각 이름은 쉼표(,)로 구분하고, 다른 설명은 절대 붙이지 마.
        - 예시: 김민준,이서연,박지훈,최수아,정현우
        """

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 사용자의 요청에 따라 창의적인 캐릭터 이름을 생성하는 작명가입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_names = response.choices[0].message.content.strip()
        return jsonify({'names': generated_names})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '이름을 생성하는 중 오류가 발생했습니다.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
