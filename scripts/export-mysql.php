<?php
// CLI only. Stream directly to the importer; export contains personal data and password hashes.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__, 2).'/bootstrap.php';
$tables=['users','store_categories','products','store_settings','store_payments','shop_orders','shop_order_items'];
$data=[];
$db->exec("SET time_zone = '+00:00'");
$db->beginTransaction();
try {
 foreach($tables as $table) $data[$table]=q('SELECT * FROM '.$table)->fetchAll();
 $db->commit();
 echo json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
} catch(Throwable $error) { if($db->inTransaction())$db->rollBack();fwrite(STDERR,'Export failed. No data imported.'.PHP_EOL);exit(1); }
