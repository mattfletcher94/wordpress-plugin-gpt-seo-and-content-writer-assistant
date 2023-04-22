<?php

class GPT_SEO_Assistant_Admin
{

	private $plugin_name;

	private $version;

	public function __construct($plugin_name, $version) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'dist/style.css', array(), $this->version, 'all' );
	}

	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'dist/main.js', array(), $this->version, true);
		wp_localize_script($this->plugin_name, 'gpt_seo_assistant_ajax', array(
			'url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('ajax-nonce'),
			'post_type' => get_post_type()
		));
	}

	public function register_menu() {
		add_menu_page(
			'GPT SEO Assistant', 
			'GPT SEO Assistant', 
			'manage_options', 
			$this->plugin_name . '-admin', 
			array($this, 'render_plugin'), 
			'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" /></svg>'), 
			100
		);
	}

	public function register_settings() {
		register_setting( 'gpt-seo-assistant-settings-group', 'gpt_seo_assistant_business_name' );
		register_setting( 'gpt-seo-assistant-settings-group', 'gpt_seo_assistant_business_description' );
		register_setting( 'gpt-seo-assistant-settings-group', 'gpt_seo_assistant_business_tonality' );
		register_setting( 'gpt-seo-assistant-settings-group', 'gpt_seo_assistant_openai_api_key' );
	}

	public function register_metabox() {
		$post_types = get_post_types( array('public' => true) );
		add_meta_box( 
			'wpAIAssistantMetaBox',
			'GPT SEO Assistant',
			array($this, 'render_metabox'), 
			$post_types, 
			'side',
			'default'
		);
	}

	public function register_ajax() {

		add_action("wp_ajax_gpt_seo_assistant_get_settings", function () {
			$this->auth_middleware($_POST['nonce']);
			$settings = $this->get_settings();
			$settings['gpt_seo_assistant_openai_api_key'] = $settings['gpt_seo_assistant_openai_api_key'] ? '**************************' : '';
			echo json_encode($settings);
			die();
		});

		add_action("wp_ajax_gpt_seo_assistant_update_settings", function () {
			$this->auth_middleware($_POST['nonce']);
			$data = json_decode(stripslashes($_POST['data']));

			if (isset($data->gpt_seo_assistant_openai_api_key)) {
				update_option('gpt_seo_assistant_openai_api_key', sanitize_text_field($data->gpt_seo_assistant_openai_api_key));
			}

			if (isset($data->gpt_seo_assistant_business_name)) {
				$name = sanitize_text_field($data->gpt_seo_assistant_business_name);
				$name = substr($name, 0, 100);
				update_option('gpt_seo_assistant_business_name', $name);
			}

			if (isset($data->gpt_seo_assistant_business_description)) {
				$desc = sanitize_text_field($data->gpt_seo_assistant_business_description);
				$desc = substr($desc, 0, 500);
				update_option('gpt_seo_assistant_business_description', $desc);
			}

			if (isset($data->gpt_seo_assistant_business_tonality)) {
				update_option('gpt_seo_assistant_business_tonality', sanitize_text_field($data->gpt_seo_assistant_business_tonality));
			}

			$settings = $this->get_settings();
			$settings['gpt_seo_assistant_openai_api_key'] = $settings['gpt_seo_assistant_openai_api_key'] ? '**************************' : '';

			echo json_encode($settings);
			die();
		});

		add_action("wp_ajax_gpt_seo_assistant_update_openai_api_key", function () {
			$this->auth_middleware($_POST['nonce']);
			$data = json_decode(stripslashes($_POST['data']));
			
			if (isset($data->gpt_seo_assistant_openai_api_key)) {
				update_option('gpt_seo_assistant_openai_api_key', sanitize_text_field($data->gpt_seo_assistant_openai_api_key));
			}

			$openai_api_key = get_option('gpt_seo_assistant_openai_api_key', '');

			echo json_encode(array(
				'gpt_seo_assistant_openai_api_key' => get_option('gpt_seo_assistant_openai_api_key', '')
			));
			die();
		});

		add_action('wp_ajax_gpt_seo_assistant_check_openai_api_key', function() {
			$this->auth_middleware($_POST['nonce']);
			$settings = $this->get_settings();
			$data = json_decode(stripslashes($_POST['data']), true);

			$data = array(
					'model' => 'gpt-3.5-turbo',
					'messages' => array(array(
							'role' => 'user',
							'content' => 'Reply OK if you see this'
					)),
					'temperature' => 0.7,
					'max_tokens' => 250,
			);

			$ch = curl_init('https://api.openai.com/v1/chat/completions');
			$headers = array(
				'Content-Type: application/json',
				'Authorization: Bearer ' . $settings['gpt_seo_assistant_openai_api_key']
			);

			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			$response = curl_exec($ch);

			if (curl_errno($ch)) {
				echo json_encode(array(
					'status' => 'error',
					'error' => 'An error occurred while processing your request.'
				));
				die();
			}

			curl_close($ch);

			$json_response = json_decode($response, true);

			if (isset($json_response['choices'][0]['message']['content'])) {
				echo json_encode(array(
					'status' => 'ok',
					'data' => 'API key is valid.'
				));
				die();
			} else {
				if (isset($json_response['error']['message'])) {
					echo json_encode(array(
						'status' => 'error',
						'error' => $json_response['error']['message']
					));
					die();
				} else {
					echo json_encode(array(
						'status' => 'error',
						'error' => 'Something went wrong. Please try again.'
					));
					die();
				}
			}
			die();
		});

		add_action('wp_ajax_gpt_seo_assistant_ask_gpt', function() {
			$this->auth_middleware($_POST['nonce']);
			$settings = $this->get_settings();
			$data = json_decode(stripslashes($_POST['data']), true);

			if (!isset($data['task']) || !isset($data['page_description'])) {
				echo json_encode(array(
					'status' => 'error',
					'error' => 'Missing data.'
				));
				die();
			}

			$tasks = array(
				'h1' => array(
					'task' => 'Generate a non-generic SEO heading for the <h1></h1> tag for this page. Do not include HTML.',
					'amountCharacters' => 'min 20, max 150',
				),
				'h2' => array(
					'task' => 'Generate a non-generic fluffy sub-heading for the <h2><h2> tag for this page. This supplements the h1 tag.  Do not include HTML.',
					'amountCharacters' => 'min 20, max 200',
				),
				'title' => array(
					'task' => 'Generate the content for a SEO friendly <title></title> tag for this page. Do not include HTML.',
					'amountCharacters' => 'min 20, max 66',
				),
				'meta_description' => array(
					'task' => 'Generate less than 142 characters of text for the <meta name="description" content=""> tag for the described page. Do not include HTML.',
					'amountCharacters' => 'min 107, max 142',
				),
				'meta_keywords' => array(
					'task' => 'Generate the content for the <meta name="keywords" content="..."> tag for this page. Do not include HTML.',
					'amountCharacters' => 'Any length',
				),
				'slug' => array(
					'task' => 'Generate the slug for this page.',
					'amountCharacters' => 'Any length',
				),
				'paragraph' => array(
					'task' => 'Generate a paragraph of content for this page. Do not include HTML.',
					'amountCharacters' => 'min 100, max 1000',
				),
				'blog_post' => array(
					'task' => 'Generate a short blog post of two or three paragraphs for this page. Include spaces between paragraphs. Do not include HTML.',
					'amountCharacters' => 'min 500, max 1000',
				),
			);

			// If task isn't valid, return error
			if (!isset($tasks[$data['task']])) {
				echo json_encode(array(
					'status' => 'error',
					'error' => 'Invalid task.'
				));
				die();
			}

			$task = $tasks[$data['task']];
			$page_description = $data['page_description'];
			$page_description = substr($page_description, 0, 500);

			$gpt_system_message = '
				You are an SEO and content writing expert. 
				Based on the provided details about a business, a short description of the page being built, 
				and a specific task, generate content adhering to the character limit. 
				You are creative and do not respond with generic content.

				The input will have the following structure:
				
				{
					"businessName": string,
					"businessDescription": string,
					"businessTonality": string,
					"pageDescription": string,
					"amountCharacters": string,
					"task": string
				}
				
				Respond ONLY with the content you generated.
			';
			
			$gpt_user_message = '
				{
					"businessName": "'.$settings["gpt_seo_assistant_business_name"].'",
					"businessDescription": "'.$settings["gpt_seo_assistant_business_description"].'",
					"businessTonality": "'.$settings["gpt_seo_assistant_business_tonality"].'",
					"pageDescription": "'.$page_description.'",
					"amountCharacters": "'.$task['amountCharacters'].'",
					"task": "'.$task['task'].'"
				}';

			$ch = curl_init('https://api.openai.com/v1/chat/completions');
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Content-Type: application/json',
				'Authorization: Bearer ' . $settings['gpt_seo_assistant_openai_api_key']
			));
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array(
				'model' => 'gpt-3.5-turbo',
				'messages' => array(
					array('role' => 'system', 'content' => $gpt_system_message),
					array('role' => 'user', 'content' => $gpt_user_message),
				),
				'temperature' => 0.95,
				'max_tokens' => 1000,
			)));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			$response = curl_exec($ch);

			if (curl_errno($ch)) {
				echo json_encode(array(
					'status' => 'error',
					'error' => 'An error occurred while processing your request.'
				));
				die();
			}

			curl_close($ch);

			$json_response = json_decode($response, true);

			if (isset($json_response['choices'][0]['message']['content'])) {
				$generated_text = $json_response['choices'][0]['message']['content'];

				// if the text starts and ends with quotes, remove them
				if (substr($generated_text, 0, 1) == '"' && substr($generated_text, -1) == '"') {
					$generated_text = substr($generated_text, 1, -1);
				}

				echo json_encode(array(
					'status' => 'ok',
					'data' => $generated_text,
				));
				die();
			} else {
				if (isset($json_response['error']['message'])) {
					echo json_encode(array(
						'status' => 'error',
						'error' => $json_response['error']['message']
					));
					die();
				} else {
					echo json_encode(array(
						'status' => 'error',
						'error' => 'Something went wrong. Please try again.'
					));
					die();
				}
			}
			die();
		});

	}

	private function get_settings() {
		return array(
			'gpt_seo_assistant_openai_api_key' => get_option('gpt_seo_assistant_openai_api_key', ''),
			'gpt_seo_assistant_business_name' => get_option('gpt_seo_assistant_business_name', ''),
			'gpt_seo_assistant_business_description' => get_option('gpt_seo_assistant_business_description', ''),
			'gpt_seo_assistant_business_tonality' => get_option('gpt_seo_assistant_business_tonality', 'formal'),
		);
	}

	/** 
	 * Authentaction middleware
	 * Ensures that the user is logged in and has the correct permissions.
	 */
	public function auth_middleware($nonce) {
		if (!wp_verify_nonce(sanitize_text_field($nonce), 'ajax-nonce')) {
			echo json_encode(array(
				'success' => false,
				'message' => 'Unauthorized.',
			));
			die();
		}
		if (!current_user_can('manage_options')) {
			echo json_encode(array(
				'success' => false,
				'message' => 'Unauthorized.',
			));
			die();
		}
	}

	public function render_plugin() {
		include_once(plugin_dir_path(__FILE__) . 'gpt-seo-assistant-admin-display.php');
	}

	function wporg_save_postdata($post_id) {
		if (array_key_exists('gpt_seo_assistant_page_description', $_POST)) {
			update_post_meta($post_id, '_gpt_seo_assistant_meta_key', sanitize_text_field($_POST['gpt_seo_assistant_page_description']));
		}
	}

	public function render_metabox($post) {
		$value = get_post_meta($post->ID, '_gpt_seo_assistant_meta_key', true);
		?>
		<input hidden id="gpt_seo_assistant_page_description" name="gpt_seo_assistant_page_description" value="<?php echo $value; ?>">
		<div id="wpAIAssistantMetaBoxVueApp"></div>
		<?php
	}

}
