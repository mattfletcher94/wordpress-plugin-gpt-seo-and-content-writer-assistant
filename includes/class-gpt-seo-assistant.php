<?php

class GPT_SEO_Assistant {

	protected $loader;

	protected $plugin_name;

	protected $version;

	public function __construct() {
		if ( defined( 'GPT_SEO_ASSISTANT_VERSION' ) ) {
			$this->version = GPT_SEO_ASSISTANT_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'gpt-seo-assistant';
		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	private function load_dependencies() {

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-gpt-seo-assistant-loader.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-gpt-seo-assistant-admin.php';

		$this->loader = new GPT_SEO_Assistant_Loader();
	}

	private function define_admin_hooks() {
		$plugin_admin = new GPT_SEO_Assistant_Admin( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'register_menu' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'register_ajax' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );
		$this->loader->add_action( 'add_meta_boxes', $plugin_admin, 'register_metabox' );
		$this->loader->add_action( 'save_post', $plugin_admin, 'wporg_save_postdata' );

	}

	private function define_public_hooks() {
	}

	public function run() {
		$this->loader->run();
	}

	public function get_plugin_name() {
		return $this->plugin_name;
	}

	public function get_loader() {
		return $this->loader;
	}

	public function get_version() {
		return $this->version;
	}

}
