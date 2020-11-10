import React, { useEffect } from 'react';
import './suggestion.css';

import vegetable from '../../icons/report/vegetable.svg';
import akkermansia from '../../icons/report/akkermansia.svg';
import weight from '../../icons/report/weight.svg';
import probiotics from '../../icons/report/probiotics.svg';
import prebiotics from '../../icons/report/prebiotics.svg';
import no_smoking from '../../icons/report/no-smoking.svg';
import no_beer from '../../icons/report/no-beer.svg';
import no_antibiotics from '../../icons/report/no-antibiotics.svg';
import do_exercise from '../../icons/report/do-exercise.svg';
import do_sleep from '../../icons/report/do-sleep.svg';
import { slideUp } from '../../utils/slideUp';


const Suggestion = () => {
    useEffect(() => {
        slideUp();
        document.title = '改善建议';
    },[]);
    return (
        <div className='suggestion-container'>
            <div className='suggestion-title'>
                <span>菌群改善建议</span>
            </div>
            <div className='suggestion-title-sm'>
                饮食建议
            </div>
            <div className='sug-food'>
                <div>
                    <div className='sug-item-img'><img src={vegetable} /><div>适当增加富含膳食纤维的食物摄入</div></div>
                    <div className='sug-item-content'>
                        未精制的粗粮谷物及根茎菜叶，如糙米、燕麦、山药、马铃薯、芹菜等，
                        富含膳食纤维可以被肠道菌群代谢并产生短链脂肪酸，有助于肠道健康。
                        中国营养学会推荐：人体每日膳食纤维摄入量为25-35克。
                    </div>
                </div>
                <div>
                    <div className='sug-item-img'><img src={akkermansia} /><div>增加阿克曼氏菌含量</div></div>
                    <div className='sug-item-content'>
                        增加葡萄、蓝莓、西兰花、洋葱、香芹、卷心菜、茶、核桃、杏仁、粗粮等富含多酚的食物促进肠道中阿克曼氏菌的含量增加。
                        避免大量饮酒和高脂饮食，否则会破坏肠道黏膜，剥夺阿克曼氏菌的定植场所。
                    </div>
                </div>
                <div>
                    <div className='sug-item-img'><img src={weight} /><div>控制体重饮食</div></div>
                    <div className='sug-item-content'>建立健康饮食习惯，三餐规律、控制进食速度、不熬夜、避免暴饮暴食、减少在外就餐。
                        控制能量摄入，对于BMI大于28的肥胖人群，建议能量摄入每天减少300~500 kcal，
                        严格控制食用油和脂肪的摄入，适量控制精白米面和肉类，保证蔬菜水果和牛奶的摄入充足。
                    </div>
                </div>
            </div>
            <div className='suggestion-title-sm'>
                微生物制剂的补充
            </div>
            <div className='sug-biotics'>
            <div>
                <div className='sug-item-img'><img src={probiotics} /><div>益生菌补充</div></div>
                    <div className='sug-item-content'>
                    可通过直接补充含乳酸杆菌、双歧杆菌的益生菌制剂来提升双歧杆菌、阿克曼氏菌等有益菌的含量，竞争性抑制有害菌生长，
                    以降低有害菌的含量，调节肠道菌群平衡，促进身体健康。
                    <p>建议优先选择多菌株配方的微生态制剂，具有临床研究证据的菌株优先选择。</p>
                    </div>
                </div>
                <div>
                    <div className='sug-item-img'><img src={prebiotics} /><div>益生元补充</div></div>
                    <div className='sug-item-content'>检测结果显示您的肠道处于失衡状态，可补充含低聚果糖、低聚半乳糖、低聚异麦芽糖、
                    菊粉、抗性淀粉等在内的复合型益生元产品，
                    此类益生元进入肠道后，不能被有害菌利用，可被如双歧杆菌、乳酸杆菌等有益菌选择性利用，
                    促进这些有益菌的生长，限制有害菌繁殖，从而达到肠道菌群平衡的作用。
                    </div>
                </div>
            </div>
            <div className='suggestion-title-sm'>
                生活方式
            </div>
            <div className='sug-lifeStyle'>
                <div className='sug-lifeStyle-img'><img src={no_smoking} />戒烟</div>
                <div className='sug-lifeStyle-img'><img src={no_beer} />避免过度饮酒</div>
                <div className='sug-lifeStyle-img'><img src={no_antibiotics} />避免滥用抗生素</div>
                <div className='sug-lifeStyle-img'><img src={do_exercise} />适当运动</div>
                <div className='sug-lifeStyle-img'><img src={do_sleep} />保持充足睡眠</div>
            </div>
        </div>
    );
}

export default Suggestion;