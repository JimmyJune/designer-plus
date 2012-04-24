<?php

$version = '0.1';

date_default_timezone_set('America/Chicago');
header('Content-type: text/plain');

$cwd = getcwd() . '/';
$yui = $cwd.'yuicompressor-2.4.7.jar';
$cssfile = $cwd.'source/designer-plus.css';
$fullfile = $cwd.'designer-plus-full.js';
$targetfile = $cwd.'designer-plus.min.js';

$html = file_get_contents('source/designer-plus.html');
$html = str_replace(array("\n","\r","\t"), '', $html);

exec( "java -jar {$yui} --type css --charset utf-8 {$cssfile}", $mini_css );
$css = implode("\n", $mini_css );

$js = file_get_contents('source/designer-plus-dev.js');
$js = strtr($js, array(
	'%css%' => $css,
	'%html%' => $html,
	'%version%' => $version,
	'%current%' => date('y')
));

if ( file_put_contents($fullfile, $js ) ) {	
	passthru("java -jar {$yui} {$fullfile} -o {$targetfile} --line-break 4000 --charset utf-8", $result);
	echo ( ! $result ) ? "Designer+ {$version} minified & built\n" : "build fail\n";
}
else {
	echo "build fail\n";
}
