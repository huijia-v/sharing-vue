// // 关闭指定tab页签
// closePage(obj) {
// 	if (obj === undefined) {
// 		return useTagsViewStore().delView(router.currentRoute.value).then(({ visitedViews }) => {
// 			const latestView = visitedViews.slice(-1)[0]
// 			if (latestView) {
// 				return router.push(latestView.fullPath)
// 			}
// 			return router.push('/');
// 		});
// 	}
// 	return useTagsViewStore().delView(obj);
// },
