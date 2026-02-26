//src/lib/malicious-patterns.ts
export const MALICIOUS_PATTERNS = [
  // WordPress探索
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/wordpress/i,
  /\/xmlrpc\.php/i,
  /\/wp-includes/i,
  /\/wp-json/i,
  // 設定ファイル探索
  /\/\.env\./i,               // .env.bakなど
  /\/artisan/i,
  /\/\.env/i,
  /\/\.git/i,
  /\/\.ssh/i,
  /\/config\.(php|yml|yaml|json|ini)/i,
  /\/setup-config\.php/i,
  /\/configuration\.php/i,
  /\/settings\.php/i,
  /\/v1\/config/i,
  /\/actuator/i,           // Spring Boot
  /\/swagger/i,
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
  /\/\.DS_Store/i,
  /\/\.htaccess/i,
  /\/\.htpasswd/i,
  /\/cgi-bin/i,
  /\/etc\/passwd/i,
  /\/proc\/self/i,
  /\/vendor\/phpunit/i,
  /\.\.\//,   // ../
  /%2e%2e%2f/i, // URLエンコード
];

export function isMaliciousPath(pathname: string): boolean {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(pathname));
}
