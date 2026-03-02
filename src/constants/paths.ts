// my-admin/src/constants/paths.ts
import path from 'path';

// 현재 내 위치: /Users/.../wow-project/my-admin
const ADMIN_ROOT = process.cwd();

// 포트폴리오 위치: /Users/.../wow-project/my-portfolio
// 바로 한 단계 위로 가서 옆 폴더로 들어갑니다.
const PORTFOLIO_ROOT = path.resolve(ADMIN_ROOT, '../my-portfolio');

export const DB_TEMP_PROFILE = path.join(ADMIN_ROOT, 'data', 'testProfile.json');

export const DB_PATH = path.join(PORTFOLIO_ROOT, 'data', 'myDB.json');
// (주의: 포트폴리오의 db.json이 public/data/ 안에 있다면 경로를 맞춰주세요!)
export const UPLOAD_DIR = path.join(PORTFOLIO_ROOT, 'public', 'uploads');

// 휴지통 관리 (admin 내부 data 폴더 활용)
export const TRASH_DB_PATH = path.join(ADMIN_ROOT, 'data', 'trashDB.json');
export const TRASH_FILES_DIR = path.join(ADMIN_ROOT, 'data', 'trash_storage');

console.log('--- 🚀 경로 설정 업데이트 완료 ---');
console.log('Admin 위치:', ADMIN_ROOT);
console.log('Portfolio 위치:', PORTFOLIO_ROOT);
console.log('DB 타겟:', DB_PATH);
console.log('업로드 타겟:', UPLOAD_DIR);
console.log('-------------------------------');