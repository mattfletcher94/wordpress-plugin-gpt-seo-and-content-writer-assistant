<?php
/**
 * @wordpress-plugin
 * Plugin Name:       GPT SEO and Content Writer Assistant
 * Description:       This plugin will help you write SEO friendly content and optimize your site for search engines.
 * Version:           1.0.1
 * Author:            Matt Fletcher
 * Author URI:        https://mattfletcher.dev
 * Text Domain:       gpt-seo-assistant
 * Domain Path:       /languages
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

// Update checker
require 'plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/mattfletcher94/wordpress-plugin-gpt-seo-and-content-writer-assistant/',
	__FILE__,
	'gpt-seo-and-content-writer-assistant'
);

$myUpdateChecker->setBranch('main');


define( 'GPT_SEO_ASSISTANT_VERSION', '1.0.1' );

function activate_gpt_seo_assistant() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-gpt-seo-assistant-activator.php';
	GPT_SEO_Assistant_Activator::activate();
}

function deactivate_gpt_seo_assistant() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-gpt-seo-assistant-deactivator.php';
	GPT_SEO_Assistant_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_gpt_seo_assistant' );
register_deactivation_hook( __FILE__, 'deactivate_gpt_seo_assistant' );

require plugin_dir_path( __FILE__ ) . 'includes/class-gpt-seo-assistant.php';

function run_gpt_seo_assistant() {

	$plugin = new GPT_SEO_Assistant();
	$plugin->run();

}

run_gpt_seo_assistant();
