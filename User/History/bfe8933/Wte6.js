const baseUrl = "http://81.70.1.26:8801"
function request({ url, data }) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			data,
			method,
			success: ({
				data,
				statusCode,
				header
			}) => {
				if (data.success) {
					// 请求成功
					resolve(data)
				} else {
					// 请求失败
					uni.showToast({
						title: data.message,
						icon: 'none',
						mask: true,
						duration: 3000
					})
					reject(data.message)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
