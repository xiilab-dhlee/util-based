/**
 * 파일 트리 관련 공통 상수
 *
 * 워크로드, 볼륨 등 다양한 도메인에서 파일 트리 구조를
 * 사용할 수 있도록 범용적으로 제공합니다.
 */

/**
 * 파일 확장자별 타입 정의
 */
export const FILE_EXTENSIONS = {
  images: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
  documents: ["pdf", "doc", "docx", "txt", "md"],
  data: ["csv", "json", "xml", "yaml", "yml"],
  code: ["py", "js", "ts", "tsx", "jsx", "java", "cpp", "c", "go", "rs"],
  notebooks: ["ipynb"],
  models: ["pth", "h5", "pkl", "onnx", "pb"],
  configs: ["yaml", "yml", "json", "toml", "ini"],
  logs: ["log", "txt"],
  archives: ["zip", "tar", "gz", "rar"],
};

/**
 * 파일 크기 범위 정의
 */
export const FILE_SIZE_RANGES = {
  small: { min: 1, max: 100, unit: "KB" }, // 1KB - 100KB
  medium: { min: 100, max: 1024, unit: "KB" }, // 100KB - 1MB
  large: { min: 1, max: 10, unit: "MB" }, // 1MB - 10MB
  xlarge: { min: 10, max: 500, unit: "MB" }, // 10MB - 500MB
} as const;

/**
 * ML 프로젝트 디렉토리 구조 템플릿
 *
 * 생성 구조:
 * /
 * ├── datasets/
 * │   ├── train/
 * │   │   ├── images/
 * │   │   │   ├── cat_001.jpg
 * │   │   │   ├── dog_001.jpg
 * │   │   │   ├── bird_001.jpg
 * │   │   │   ├── car_001.jpg
 * │   │   │   └── tree_001.jpg
 * │   │   └── labels.csv
 * │   ├── validation/
 * │   │   └── images/
 * │   │       ├── test_001.jpg
 * │   │       ├── test_002.jpg
 * │   │       └── test_003.jpg
 * │   └── metadata.json
 * ├── models/
 * │   ├── checkpoints/
 * │   │   ├── model_epoch_10.pth
 * │   │   ├── model_epoch_20.pth
 * │   │   ├── model_epoch_30.pth
 * │   │   └── best_model.pth
 * │   └── config.yaml
 * ├── notebooks/
 * │   ├── data_exploration.ipynb
 * │   ├── model_training.ipynb
 * │   ├── evaluation.ipynb
 * │   └── hyperparameter_tuning.ipynb
 * ├── src/
 * │   ├── train.py
 * │   ├── model.py
 * │   ├── dataset.py
 * │   ├── utils.py
 * │   ├── config.py
 * │   └── evaluate.py
 * ├── outputs/
 * │   ├── logs/
 * │   │   ├── training.log
 * │   │   ├── validation.log
 * │   │   └── test.log
 * │   └── visualizations/
 * │       ├── loss_curve.png
 * │       ├── accuracy_curve.png
 * │       ├── confusion_matrix.png
 * │       └── roc_curve.png
 * ├── README.md
 * ├── requirements.txt
 * ├── docker-compose.yml
 * └── .gitignore
 */
export const ML_PROJECT_TEMPLATE = {
  datasets: {
    train: {
      images: [
        "cat_001.jpg",
        "dog_001.jpg",
        "bird_001.jpg",
        "car_001.jpg",
        "tree_001.jpg",
      ],
      "labels.csv": true,
    },
    validation: {
      images: ["test_001.jpg", "test_002.jpg", "test_003.jpg"],
    },
    "metadata.json": true,
  },
  models: {
    checkpoints: [
      "model_epoch_10.pth",
      "model_epoch_20.pth",
      "model_epoch_30.pth",
      "best_model.pth",
    ],
    "config.yaml": true,
  },
  notebooks: [
    "data_exploration.ipynb",
    "model_training.ipynb",
    "evaluation.ipynb",
    "hyperparameter_tuning.ipynb",
  ],
  src: [
    "train.py",
    "model.py",
    "dataset.py",
    "utils.py",
    "config.py",
    "evaluate.py",
  ],
  outputs: {
    logs: ["training.log", "validation.log", "test.log"],
    visualizations: [
      "loss_curve.png",
      "accuracy_curve.png",
      "confusion_matrix.png",
      "roc_curve.png",
    ],
  },
  "@files": [
    "README.md",
    "requirements.txt",
    "docker-compose.yml",
    ".gitignore",
  ],
} as const;
