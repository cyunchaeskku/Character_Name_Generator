document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('name-form');
    const generateBtn = document.getElementById('generate-btn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');

    nameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 폼 데이터 가져오기
        const year = document.getElementById('year').value.trim();
        const background = document.getElementById('background').value.trim();
        const personality = document.getElementById('personality').value.trim();
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value.trim();
        const situation = document.getElementById('situation').value.trim();

        if (!year || !background || !personality || !age || !situation) {
            alert('모든 필드를 채워주세요!');
            return;
        }

        // 로딩 상태 표시
        loadingDiv.classList.remove('hidden');
        resultsDiv.innerHTML = ''; // 이전 결과 초기화
        generateBtn.disabled = true;
        generateBtn.textContent = '생성 중...';

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    year,
                    background,
                    personality,
                    gender,
                    age,
                    situation
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버에서 오류가 발생했습니다.');
            }

            const data = await response.json();
            displayNames(data.names);

        } catch (error) {
            resultsDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
        } finally {
            // 로딩 상태 해제
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = '이름 생성하기';
        }
    });

    function displayNames(namesString) {
        if (!namesString) {
            resultsDiv.innerHTML = '<p class="placeholder">생성된 이름이 없습니다.</p>';
            return;
        }
        
        const namesArray = namesString.split(',').map(name => name.trim()).filter(name => name);
        
        if (namesArray.length === 0) {
            resultsDiv.innerHTML = '<p class="placeholder">생성된 이름이 없습니다.</p>';
            return;
        }

        resultsDiv.innerHTML = ''; // 기존 placeholder 제거
        namesArray.forEach(name => {
            const p = document.createElement('p');
            p.textContent = name;
            resultsDiv.appendChild(p);
        });
    }
});