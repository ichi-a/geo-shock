export const MALICIOUS_PATTERNS = [
  // WordPress探索
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/wordpress/i,
  /\/xmlrpc\.php/i,
  // 設定ファイル探索
  /\/\.env/i,
  /\/\.git/i,
  /\/\.ssh/i,
  /\/config\.(php|yml|yaml|json|ini)/i,
  /\/setup-config\.php/i,
  /\/configuration\.php/i,
  /\/settings\.php/i,
  // 管理画面探索
  /\/admin\.php/i,
  /\/phpmyadmin/i,
  /\/phpinfo/i,
  /\/shell\.php/i,
  /\/cmd\.php/i,
  /\/eval-stdin\.php/i,
  // バックアップファイル
  /\/backup/i,
  /\/dump\.sql/i,
  /\/db\.sql/i,
  /\/database\.sql/i,
  // 脆弱性スキャン
  /\/etc\/passwd/i,
  /\/proc\/self/i,
  /\/vendor\/phpunit/i,
];

export function isMaliciousPath(pathname: string): boolean {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(pathname));
}
