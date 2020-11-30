import React from 'react';
import { View, Image } from '@tarojs/components';
import './moduleE.css';
import { imgSrc } from '../../config';

const ModuleE = () => {

    let imageUrl = {
        vegetable : imgSrc + '/icons/report/vegetable.svg',
        akkermansia : imgSrc + '/icons/report/akkermansia.svg',
        weight : imgSrc + '/icons/report/weight.svg',
        probiotics : imgSrc + '/icons/report/probiotics.svg',
        prebiotics : imgSrc + '/icons/report/prebiotics.svg',
        no_smoking : imgSrc + '/icons/report/no-smoking.svg',
        no_beer : imgSrc + '/icons/report/no-beer.svg',
        no_antibiotics : imgSrc + '/icons/report/no-antibiotics.svg',
        do_exercise : imgSrc + '/icons/report/do-exercise.svg',
        do_sleep : imgSrc + '/icons/report/do-sleep.svg'
    }
    
    
    return (
        <View className='M-container'>
            <View className='suggestion-title-sm'>
                友情提示
            </View>
            <View className='sug-advice'>*菌群改善建议部分正在持续完善中，目前结果仅供参考。</View>
            <View className='suggestion-title-sm'>
                饮食建议
            </View>
            <View className='sug-food'>
                <View className='item'>
                    <View className='sug-item-img'><Image className='img' src={imageUrl['vegetable']} /><View className='div'>适当增加富含膳食纤维的食物摄入</View></View>
                    <View className='sug-item-content'>
                        未精制的粗粮谷物及根茎菜叶，如糙米、燕麦、山药、马铃薯、芹菜等，
                        富含膳食纤维可以被肠道菌群代谢并产生短链脂肪酸，有助于肠道健康。
                        中国营养学会推荐：人体每日膳食纤维摄入量为25-35克。
                    </View>
                </View>
                <View className='item'>
                    <View className='sug-item-img'><Image className='img' src={imageUrl['akkermansia']} /><View className='div'>增加阿克曼氏菌含量</View></View>
                    <View className='sug-item-content'>
                        增加葡萄、蓝莓、西兰花、洋葱、香芹、卷心菜、茶、核桃、杏仁、粗粮等富含多酚的食物促进肠道中阿克曼氏菌的含量增加。
                        避免大量饮酒和高脂饮食，否则会破坏肠道黏膜，剥夺阿克曼氏菌的定植场所。
                    </View>
                </View>
                <View className='item'>
                    <View className='sug-item-img'><Image className='img' src={imageUrl['weight']} /><View className='div'>控制体重饮食</View></View>
                    <View className='sug-item-content'>建立健康饮食习惯，三餐规律、控制进食速度、不熬夜、避免暴饮暴食、减少在外就餐。
                        控制能量摄入，对于BMI大于28的肥胖人群，建议能量摄入每天减少300~500 kcal，
                        严格控制食用油和脂肪的摄入，适量控制精白米面和肉类，保证蔬菜水果和牛奶的摄入充足。
                    </View>
                </View>
            </View>
            <View className='suggestion-title-sm'>
                微生态制剂的补充
            </View>
            <View className='sug-biotics'>
                <View className='item'>
                    <View className='sug-item-img'><Image className='img' src={imageUrl['probiotics']} /><View className='div'>益生菌补充</View></View>
                        <View className='sug-item-content'>
                        通过直接补充含乳酸杆菌、双歧杆菌的益生菌制剂来提升双歧杆菌、阿克曼氏菌等有益菌的含量，竞争性抑制有害菌生长，
                        以降低有害菌的含量，调节肠道菌群平衡，促进身体健康。
                        <View>建议优先选择多菌株配方的微生态制剂，具有临床研究证据的菌株优先选择。</View>
                        </View>
                    </View>
                <View className='item'>
                    <View className='sug-item-img'><Image className='img' src={imageUrl['prebiotics']} /><View className='div'>益生元补充</View></View>
                    <View className='sug-item-content'>补充含低聚果糖、低聚半乳糖、低聚异麦芽糖、菊粉、抗性淀粉等在内的复合型益生元产品。
                    此类益生元进入肠道后，不能被有害菌利用，可被如双歧杆菌、乳酸杆菌等有益菌选择性利用，
                    促进这些有益菌的生长，限制有害菌繁殖，从而达到肠道菌群平衡的作用。
                    </View>
                </View>
            </View>
            <View className='suggestion-title-sm'>
                生活方式
            </View>
            <View className='sug-lifeStyle'>
                <View className='sug-lifeStyle-img'><Image className='img' src={imageUrl['no_smoking']} />戒烟</View>
                <View className='sug-lifeStyle-img'><Image className='img' src={imageUrl['no_beer']} />避免过度饮酒</View>
                <View className='sug-lifeStyle-img'><Image className='img' src={imageUrl['no_antibiotics']} />避免滥用抗生素</View>
                <View className='sug-lifeStyle-img'><Image className='img' src={imageUrl['do_exercise']} />适当运动</View>
                <View className='sug-lifeStyle-img'><Image className='img' src={imageUrl['do_sleep']} />保持充足睡眠</View>
            </View>
        </View>
    );
}

export default ModuleE;