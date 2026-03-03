import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	sassOptions: {
		quietDeps: true, // 이 옵션을 추가하면 node_modules나 믹스인 경고가 조용해집니다.
		// silenceDeprecations: ['import']는 내 프로젝트의 @import 경고를 숨깁니다.
		silenceDeprecations: ['import', 'global-builtin'],
	},

};

export default nextConfig;
