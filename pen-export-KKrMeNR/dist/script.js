var boardCount = 1;
var dataLists = {};
var resultLabels = {};
var dataLabels = {};

function resetData(boardId) {
  var boardContainer = document.getElementById(boardId);
  var container = document.getElementById('container');

  // Check if the board container exists and is a child of the container
  if (boardContainer && container.contains(boardContainer)) {
    // Remove the board container from the container element
    container.removeChild(boardContainer);

    // Clear the data list
    delete dataLists[boardId];
    delete resultLabels[boardId];
    delete dataLabels[boardId];
  }
}

function createBoard() {
  var boardId = 'board' + boardCount;
  var container = document.getElementById('container');

  // Create board container
  var boardContainer = document.createElement('div');
  boardContainer.classList.add('container');
  boardContainer.id = boardId;
  container.appendChild(boardContainer);

  // Create board title
  var title = document.createElement('h1');
  title.innerText = '패턴 분석 프로그램 예측값';
  boardContainer.appendChild(title);

  // Create button group
  var buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');
  boardContainer.appendChild(buttonGroup);

  // Create buttons
  var buttons = ['P', 'B', 'T'];
  buttons.forEach(function (label) {
    var button = document.createElement('button');
    button.classList.add('pattern-button');
    button.innerText = label;
    button.addEventListener('click', function () {
      buttonClicked(label, boardId);
    });
    buttonGroup.appendChild(button);
  });

  // Create data label
  var dataLabel = document.createElement('div');
  dataLabel.classList.add('data-label');
  dataLabel.id = 'data-label-' + boardId;
  boardContainer.appendChild(dataLabel);
  dataLabels[boardId] = dataLabel;

  // Create result label
  var resultLabel = document.createElement('div');
  resultLabel.classList.add('result-label');
  resultLabel.id = 'result-label-' + boardId;
  boardContainer.appendChild(resultLabel);
  resultLabels[boardId] = resultLabel;

  // Create reset button
  var resetButton = document.createElement('button');
  resetButton.classList.add('reset-button');
  resetButton.innerText = '데이터 초기화';
  resetButton.addEventListener('click', function () {
    resetData(boardId);
  });
  boardContainer.appendChild(resetButton);

  // Initialize data list
  dataLists[boardId] = [];

  boardCount++;
}

function trainModel(trainingData) {
  // 각 값의 빈도를 계산하여 확률을 구합니다.
  var counts = {};
  for (var i = 0; i < trainingData.length; i++) {
    var value = trainingData[i];
    if (counts[value]) {
      counts[value]++;
    } else {
      counts[value] = 1;
    }
  }

  // 확률을 계산합니다.
  var probabilities = {};
  var total = trainingData.length;
  for (var key in counts) {
    probabilities[key] = counts[key] / total;
  }

  // 훈련된 모델(확률 분포)을 반환합니다.
  return probabilities;
}

function makePrediction(trainedModel) {
  // 가장 높은 확률을 가진 값을 예측으로
  // 훈련된 모델에서 가장 높은 확률을 가진 값을 찾습니다.
  var maxProbability = 0;
  var predictedValue = '';
  for (var key in trainedModel) {
    if (trainedModel[key] > maxProbability) {
      maxProbability = trainedModel[key];
      predictedValue = key;
    }
  }

  // 예측값을 반환합니다.
  return predictedValue;
}

function trainAndPredict(boardId) {
  var data_list = dataLists[boardId].slice(-6); // 최근 6개의 데이터를 사용합니다.
  
  // 훈련 데이터로 모델을 훈련합니다.
  var trainedModel = trainModel(data_list);

  // 훈련된 모델을 사용하여 예측값을 생성합니다.
  var predictedValue = makePrediction(trainedModel);

  // 결과 레이블을 업데이트합니다.
  resultLabels[boardId].innerText = '예측 값: ' + predictedValue;
}

function buttonClicked(label, boardId) {
  var data_list = dataLists[boardId];

  // 데이터 리스트에 6개의 엔트리가 있는지 확인합니다.
  if (data_list.length === 6) {
    data_list.shift(); // 가장 오래된 엔트리를 제거합니다.
  }

  // 새로운 엔트리를 데이터 리스트에 추가합니다.
  data_list.push(label);

  // 데이터 레이블을 업데이트합니다.
  var dataLabel = dataLabels[boardId];
  dataLabel.innerText = '데이터: ' + data_list.join(' ');

  // 패턴을 훈련하고 예측합니다.
  trainAndPredict(boardId);
}

function resetData(boardId) {
  // 데이터 리스트를 초기화합니다.
  dataLists[boardId] = [];

  // 데이터 레이블을 초기화합니다.
  var dataLabel = dataLabels[boardId];
  dataLabel.innerText = '';

  // 결과 레이블을 초기화합니다.
  var resultLabel = resultLabels[boardId];
  resultLabel.innerText = '';
}

// 초기 보드를 생성합니다.
createBoard();

// 추가 버튼을 생성합니다.
var addButton = document.createElement('button');
addButton.classList.add('add-button');
addButton.innerText = '보드 추가';
addButton.addEventListener('click', function () {
  createBoard();
});
document.body.appendChild(addButton);