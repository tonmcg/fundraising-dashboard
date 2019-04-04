<!DOCTYPE html>
<%@ Page Language="C#" %>
<%@ Register Tagprefix="SharePoint" 
Namespace="Microsoft.SharePoint.WebControls" 
Assembly="Microsoft.SharePoint, 
Version=16.0.0.0, 
Culture=neutral, 
PublicKeyToken=71e9bce111e9429c" %>
<html>

<head>
	<!-- Basic Page Needs
	================================================== -->
	<meta charset="utf-8">
	<meta content="IE=edge" http-equiv="X-UA-Compatible">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<!-- Title and meta description
	================================================== -->
	<title>Center for Oceans Home Page</title>
	<!-- Favicons
	================================================== -->
	<!-- <link href="../SiteAssets/assets/img/favicons/favicon.ico" rel="shortcut icon" type="image/ico">
	<link href="../SiteAssets/assets/img/favicons/favico.png" rel="icon" type="image/png"> -->

	<!-- Fonts & Icons
	================================================== -->
	<link href="https://fonts.googleapis.com/css?family=Lora:100,300,400,500,700,900" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
	<link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">

	<!-- CSS
	================================================== -->
	<!-- Vuetify core CSS -->
	<link href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css" rel="stylesheet">

	<style>
		.v-btn--active {
			background: #0193d7 !important;
			color: #fff !important;
			border-radius: 0px !important;
		}

		footer .v-card {
			background: #0193d7 !important;
			color: #fff !important;
			border-radius: 0px !important;
		}
	</style>
</head>

<body>
	<!-- SharePoint-specific markup
	================================================== -->
	<form runat="server">
		<SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
		<!-- Vue Template
	================================================== -->
		<div id="app">
			<v-app>
				<toolbar></toolbar>
				<v-content class="mx-4 mb-4 mt-4">
					<router-view :width="window.width"></router-view>
				</v-content>
				<footbar></footbar>
			</v-app>
		</div>

	</form>

	<!-- JavaScript
	================================================== -->
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/moment@2.20.1/moment.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vue@2.5.18/dist/vue.js"></script>
	<script src="https://unpkg.com/http-vue-loader"></script>
	<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.js"></script>

	<!-- SharePoint-specific JavaScript
	================================================== -->
	<!-- <script src="/_layouts/1033/init.js"></script>
	<script src="/_layouts/sp.core.js"></script>
	<script src="/_layouts/sp.runtime.js"></script>
	<script src="/_layouts/sp.js"></script> -->

	<!-- Vue Pages and Components
	================================================== -->
	<script src="../SiteAssets/views/home.vue.js"></script>
	<!-- <script src="../SiteAssets/views/form.vue.js"></script>  -->
	<script src="../SiteAssets/views/shortfall.vue.js"></script>
	<script src="../SiteAssets/views/fiscalYear.vue.js"></script>
	<!-- <script src="../SiteAssets/views/projections.vue.js"></script> -->

	<script src="../SiteAssets/components/toolbar.vue.js"></script>
	<script src="../SiteAssets/components/footer.vue.js"></script>
	<!-- <script src="../SiteAssets/components/form.vue.js"></script>
	<script src="../SiteAssets/components/table.vue.js"></script> -->

	<script>
		Vue.use(VueRouter);

		const routes = [{
			path: '/',
			component: home,
			props: false
		}, {
			path: '/fiscal-year',
			component: fiscalYear,
			props: true
		}, {
			path: '/shortfall',
			component: shortfall,
			props: true
		}]

		let router = new VueRouter({
			//mode: 'history',
			routes // short for `routes: routes`
		})

		router.beforeEach((to, from, next) => {
			next()
		})

		var app = new Vue({
			el: '#app',
			data() {
				return {
					webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl,
					window: {
						width: 0,
						height: 0
					}
				};
			},
			created() {
				window.addEventListener('resize', this.handleResize);
				this.handleResize();
			},
			destroyed() {
				window.removeEventListener('resize', this.handleResize);
			},
			methods: {
				handleResize() {
					this.window.width = window.innerWidth * 0.95;
					this.window.height = window.innerHeight;
				}
			},
			router
		})
	</script>

</body>

</html>