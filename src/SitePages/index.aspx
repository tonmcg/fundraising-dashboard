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
	<title>Center for Oceans</title>
	<!-- Favicons
	================================================== -->
	<link href="../images/favicon.ico" rel="shortcut icon" type="image/ico">

	<!-- Fonts & Icons
	================================================== -->
	<link href="../SiteAssets/fonts.css" rel="stylesheet">
	<!-- <link href="https://fonts.googleapis.com/css?family=Lora:100,300,400,500,700,900" rel="stylesheet"> -->
	<link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
	<link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">

	<!-- CSS
	================================================== -->
	<!-- Vuetify core CSS -->
	<link href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css" rel="stylesheet">

	<style>
		.application {
			font-family: "ProximaNovaRegular";
		}

		h1 {
			font-family: "ProximaNovaExCondBold";
		}

		h2 {
			font-family: "ProximaNovaBold";
		}

		.introCopy {
			font-family: "ProximaNovaLight";
			font-size: 16px;
			line-height: 24px;
			font-weight: lighter;
		}

		.blockquote-reverse {
			padding-right: 15px;
			padding-left: 0;
			text-align: right;
			border-right: 5px solid #eee;
			border-left: 0;
		}

		.blockquote-paragraph {
			color: #4BB053;
			font-size: 25pt;
			margin: 0 0 10px;
		}

		.v-btn--active {
			background: #7ECBEF !important;
			color: #fff !important;
			border-radius: 0px !important;
		}

		/* footer .v-card {
			background: #03a9f4 !important;
			color: #fff !important;
			border-radius: 0px !important;
		} */
	</style>
</head>

<body>
	<!-- SharePoint-specific markup
	================================================== -->
	<form runat="server">
		<SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
	</form>

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

	<!-- JavaScript
	================================================== -->
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/moment@2.20.1/moment.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
	<script src="https://unpkg.com/http-vue-loader"></script>
	<script src="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.js"></script>

	<!-- SharePoint-specific JavaScript
	Doesn't look like we need this in SharePoint Online - T.M.
	================================================== -->
	<!-- <script src="/_layouts/1033/init.js"></script>
	<script src="/_layouts/sp.core.js"></script>
	<script src="/_layouts/sp.runtime.js"></script>
	<script src="/_layouts/sp.js"></script> -->

	<!-- Vue Pages and Components
	================================================== -->
	<script src="../SiteAssets/views/home.vue.js"></script>
	<script src="../SiteAssets/views/newGrant.vue.js"></script>
	<script src="../SiteAssets/views/shortfall.vue.js"></script>
	<script src="../SiteAssets/views/fiscalYear.vue.js"></script>
	<script src="../SiteAssets/views/projections.vue.js"></script>

	<script src="../SiteAssets/components/toolbar.vue.js"></script>
	<script src="../SiteAssets/components/footer.vue.js"></script>
	<script src="../SiteAssets/components/form.vue.js"></script>
	<!-- <script src="../SiteAssets/components/table.vue.js"></script> -->

	<script>
		Vue.use(VueRouter);

		const routes = [{
			path: '/',
			component: home,
			props: false
		}, {
			path: '/new-grant',
			component: newGrant,
			props: false
		}, {
			path: '/fiscal-year',
			component: fiscalYear,
			props: true
		}, {
			path: '/shortfall',
			component: shortfall,
			props: true
		}, {
			path: '/projections',
			component: projections,
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
			mounted: function () {
				this.$vuetify.theme.primary = '#03a9f4',
				this.$vuetify.theme.secondary = '#7ECBEF',
				this.$vuetify.theme.accent = '#8bc34a',
				this.$vuetify.theme.error = '#ff5722',
				this.$vuetify.theme.warning = '#ff9800',
				this.$vuetify.theme.info = '#607d8b',
				this.$vuetify.theme.success = '#4caf50'
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