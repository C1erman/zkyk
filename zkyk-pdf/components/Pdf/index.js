import React, { useState, useEffect } from 'react';
import './pdf.css';

import Axios from 'axios';
import WebkitProgress from '../WebkitProgress';

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

import intestineOne from '../../icons/knowledge/know-intestine-one.svg';
import intestineTwo from '../../icons/knowledge/know-intestine-two.svg';
import intestineThree from '../../icons/knowledge/know-intestine-three.svg';

const host = 'http://192.168.1.108:3000'

const PDF = () => {
    // 获取 reportId 和 user.token

    let [useR, setUser] = useState({});
    let [abnormal, setAbnormal] = useState();
    let [flora, setFlora] = useState([]);
    let [assess, setAssess] = useState([]);
    let [result, setResult] = useState([]);
  
    const getModalA = (id, token) => {
        return Axios({
            method: 'GET',
            url: host + '/sample/personal',
            params: {
                id: id,
                'access-token': token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setUser(data.data);
        }).catch(error => setUser([]));
    }
    const getModalAP = (id, token) => {
        return Axios({
            method: 'GET',
            url: host + '/sample/abnormal',
            params: {
                id: id,
                'access-token': token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setAbnormal(data.data);
        }).catch(error => console.log(error));
    }
    const getModuleB = (id, token) => {
        return Axios({
            method: 'GET',
            url: host + '/sample/metrics',
            params: {
                id: id,
                'access-token': token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setFlora(data.data);
        }).catch(error => setFlora([]));
    }
    const getModuleC = (id, token) => {
        return Axios({
            method: 'GET',
            url: host + '/sample/indicator',
            params: {
                id: id,
                'access-token': token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setAssess(data.data);
        })
            .catch(error => console.log(error));
    }
    const getModuleE = (id, token) => {
        return Axios({
            method: 'GET',
            url: host + '/sample/bacteria',
            params: {
                id: id,
                'access-token': token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setResult(data.data);
        }).catch(error => setResult([]));
    }
    useEffect(() => {
        let token = 'userToken';
        let id = 'sampleId';

        if (sampleId) {
            Axios.all([getModalA(id, token), getModalAP(id, token), getModuleB(id, token), getModuleC(id, token), getModuleE(id, token)])
                .then(Axios.spread(() => {
                    Axios({
                        method: 'POST',
                        url: host + '/admin/pdf',
                        params: {
                            'access-token': token
                        },
                        data: {
                            html: document.querySelector('.pdf').innerHTML,
                            id: id
                        },
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        responseType: 'blob'
                    }).then(_data => {
                        let filename = decodeURI(_data.headers['filename']);
                        const { data } = _data;
                        if(data){
                            let file = new File([data], '报告', {
                                type : 'application/pdf'
                            });
                            let a = document.createElement('a'),
                                url = URL.createObjectURL(file);
                            a.href = url;
                            a.download = filename + '.pdf';
                            a.click();
                            URL.revokeObjectURL(url);
                            setLoading(false);
                        }
                        else {
                            setAlertMsg('下载失败，请稍后再试');
                            alertController.on('toggle');
                        }
                    }).catch(error => console.log(error));
                }))
        }
    }, [])

    const judgeProgress = (value) => {
        if (value === '偏低') return { className: 'overview-results overview-result-below' };
        else if (value === '偏高') return { className: 'overview-results overview-result-above' };
        else return { className: 'overview-results' }
    }
    const mapRisk = {
        'low-risk' : 'low-risk',
        'middle-risk' : 'middle-risk',
        'high-risk' : 'high-risk',
        'weaker' : 'high-risk',
        'normal' : 'low-risk',
        'abnormal_low' : 'middle-risk',
        'abnormal_high' : 'high-risk'
    }
    const judgeRange = (value, min, max, type) => {
        switch (type) {
            case 'general': {
                if (value < min) {
                    return { className: 'overview-result-below' }
                }
                else if (value > max) {
                    return { className: 'overview-result-above' }
                }
            }
            case 'harmful': {
                if (value > max) {
                    return { className: 'overview-result-above' }
                }
            }
            case 'beneficial': {
                if (value < min) {
                    return { className: 'overview-result-below' }
                }
                else if (value > max) {
                    return { className: 'overview-result-above' }
                }
            }
        }
    }
    const mapBacterialType = (type) => {
        return {
            beneficial: '有益菌',
            general: '中性菌',
            harmful: '有害菌'
        }[type]
    }

    return (
        <div className='pdf'>
            <div className='page-three pages'>
                <div className="page-title three-title"><h1>整体情况</h1></div>
                {useR.age && (+ useR.age) ? (<div className='overview-age-prediction'>预测年龄：{(+ useR.age).toFixed(1)} 岁</div>) : null}
                <div className='overview-total'>
                    <div>
                        <span className='overview-total-label'>受检者<span>{useR.name}</span></span>
                        <span className='overview-total-label'>性别<span>{useR.gender}</span></span>
                    </div>
                    <div>
                        <span className='overview-total-label'>生日<span>{useR.birthday}</span></span>
                        <span className='overview-total-label'>报告日期<span>{useR.date_of_production}</span></span>
                    </div>
                </div>
                <div className='overview-abnormal'>
                    {abnormal ? (
                        <>
                            <div className='overview-abnormal-title'>根据您目前的肠道菌群情况，提示您<span>以下指标异常</span>，需要引起重视，可结合改善建议进行调理。</div>
                            <div>
                                {abnormal.metrics ? (
                                    <div className='overview-abnormal-content'>
                                        <div>菌群环境</div>
                                        <div className='overview-abnormal-content-item'>
                                            {abnormal.metrics.intestinal_defense ? (<div><span className='title'>肠道防御力：</span><span className='item'>{abnormal.metrics.intestinal_defense}</span></div>) : null}
                                            {abnormal.metrics.beneficial ? (<div><span className='title'>有益菌：</span>{abnormal.metrics.beneficial}<span className='item'>偏低</span></div>) : null}
                                            {abnormal.metrics.general ? (<div><span className='title'>中性菌：</span>{abnormal.metrics.general.lower ? (<>{abnormal.metrics.general.lower}<span className='item'>偏低</span></>) : null }
                                            {abnormal.metrics.general.higher ? (<>{abnormal.metrics.general.higher}<span className='item'>超标</span></>) : null}</div>) : null}
                                            {abnormal.metrics.harmful ? (<div><span className='title'>有害菌：</span>{abnormal.metrics.harmful}<span className='item'>超标</span></div>) : null}
                                        </div>
                                    </div>
                                ) : null}
                                {
                                    abnormal.indicator ? (
                                        <div className='overview-abnormal-content'>
                                            <div>健康指标</div>
                                            <div className='overview-abnormal-content-item'>{abnormal.indicator.map((v, i) => (
                                                <div key={i}>{v.type_zh}<span className='item-margin'>{v.rank_zh}</span></div>
                                            ))}</div>
                                    </div>
                                    ) : null
                                }
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <div className='page-four pages'>
                <div className="page-title four-title"><h1>菌群状态分析</h1></div>
                <div className='overview-flora'>
                    {flora.map((v, i) => (
                        <div key={i} className='overview-flora-items'>
                            <div className='overview-flora-item-header'>
                                <div>{v.type_zh}</div><div className={mapRisk[v.conclusion]}>{v.rank_zh}</div>
                            </div>
                            <div className='overview-flora-item-body'>
                                <div>{v.summary}</div>
                                {v.chart ? (
                                    <div className='overview-flora-item-progress'>
                                        {v.chart.map((v, i) => (
                                            <WebkitProgress key={i} label={<span>{v.name + ' '}<span {...judgeProgress(v.state)}>{v.state}</span></span>} total={(+ v.median) + '%'} percent={(+ v.proportion) + '%'} />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            {
                                v.suggestion ? (<div className='overview-flora-item-result'>{v.suggestion}</div>) : null
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className='page-five pages'>
                <div className="page-title five-title"><h1>健康指标评估</h1></div>
                <div>
                    {assess.map((v, i) => (
                        <div key={i} className='assess-items'>
                            <div className='assess-item-header'>
                                <div>{v.type_zh}</div><div className={mapRisk[v.conclusion]}>{v.rank_zh}</div>
                            </div>
                            <div className='assess-item-body'>
                                <div>{v.summary}</div>
                            </div>
                            {v.suggestion ? (<div className='assess-item-result'>
                                {v.suggestion}
                            </div>) : null}
                        </div>
                    ))}
                </div>
            </div>
            <div className='page-six pages'>
                <div className="page-title six-title"><h1>菌群改善建议</h1></div>
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
                <div className='suggestion-title-sm pageBreakBefore'>
                    微生态制剂的补充
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
                    <div className='sug-lifeStyle-img'><img src={no_smoking} /><div>戒烟</div></div>
                    <div className='sug-lifeStyle-img'><img src={no_beer} /><div>避免过度饮酒</div></div>
                    <div className='sug-lifeStyle-img'><img src={no_antibiotics} /><div>避免滥用抗生素</div></div>
                    <div className='sug-lifeStyle-img'><img src={do_exercise} /><div>适当运动</div></div>
                    <div className='sug-lifeStyle-img'><img src={do_sleep} /><div>保持充足睡眠</div></div>
                </div>
            </div>
            <div className='page-seven pages'>
                <div className="page-title seven-title"><h1>具体检测结果</h1></div>
                <div className='overview-result'>
                    <div className='overview-result-info'>* 红色表示该菌含量异常，对健康有影响</div>
                    <table>
                        <thead>
                            <tr className='overview-result-table-head'>
                                <th>名称</th><th>分类</th><th>受检者检测数值<br />（Lg CFU/g）</th><th>参考范围<br />（Lg CFU/g）</th>
                            </tr>
                        </thead>
                        <tbody className='overview-result-table-body'>
                            {result.length ? result.map(v => (
                                <tr key={v.name}>
                                    <td className='overview-result-table-name'>{v.name}</td><td>{mapBacterialType(v.type)}</td><td {...judgeRange(+ v.value, + v.range_down, + v.range_up, v.type)}>{v.value}</td>{v.range_down == 0 && v.range_up == 0 ? (<td>{v.range_down}</td>) : (<td>{v.range_down} - {v.range_up}</td>)}
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='page-eleven pages'>
                <div className="page-title eight-title"><h1>肠道菌群知识科普</h1></div>
                <div className='know-title-sm'>01. 肠道菌群是什么</div>
                <div className='know-what'>
                    <div className='know-what-content'>肠道不仅是我们人体最大的消化器官，也是人体最大的免疫器官，人体约99%的营养素和90%的毒素要在肠道中吸收和排出。
                    并且，肠道附着和集结了人体70%以上的免疫功能，产生约80%的抵抗力。
                    因此肠健康才能常健康。在人体的肠道内，大约存活有1000种细菌，总体数量在10 上，其数量是人体细胞的10倍，基因数是人类本身基因数的100倍，
                    被称为“人类第二个基因组”，编码着我们的健康。这些寄居在肠道内的菌群即为肠道菌群。</div>
                </div>
                <div className='know-title-sm'>02. 肠道菌群有哪些</div>
                <div className='know-which'>
                    <p>根据其在肠道内不同的生理功能以及对人体健康的影响，肠道菌群可被分为三大类：</p>
                    <div className='know-which-item'>
                        <div>有益菌</div>
                        <p>有益菌，也被称为益生菌，它们与人体是互惠互利的共生关系。
                        有益菌就像卫士守护家园一样，守护我们的肠道健康，具有抑制有害细菌的增长、增强肠道免疫力、维持肠道微生态平衡等多种生理功能
                        ，比如我们耳熟能详的双歧杆菌、乳酸杆菌，就是有益菌的代表。</p>
                    </div>
                    <div className='know-which-item'>
                        <div>中性菌</div>
                        <p>属于肠道菌群中的不稳定因素，它经常伺机而动，如果肠道菌群的平衡被打破，中性菌就发生叛变，
                        加入有害菌的阵营，趁机作乱引发多种疾病，代表比如肠球菌、肠杆菌。</p>
                    </div>
                    <div className='know-which-item'>
                        <div>有害菌</div>
                        <p>一般都是外源过路菌种，一旦数量超过正常水平，会导致腹泻、食物中毒等症状，代表比如沙门氏菌、志贺氏菌等。</p>
                    </div>
                    <p>正常情况下，我们肠道中有益菌是占绝对优势的，一旦有益菌减少或者有害菌增多，这种生态平衡就会被打破，胃肠道系统的功能就会出现问题。</p>
                </div>
                <div className='know-title-sm'>03. 肠道菌群的作用</div>
                <div className='know-effect'>
                    <p>由于肠道菌群与健康的联系紧密，且具有可调节性，使其在人体健康中扮演的角色越来越重要。肠道菌群与人体健康的贡献主要体现在：</p>
                    <div className='know-effect-item'>
                        <div>合成营养素</div>
                        <p>肠道菌群可以帮助消化人体自身不能消化的食物成分，合成多种人体必需的营养物质。
                        例如，细菌“吃掉”低聚糖、纤维素等未被人体消化吸收的物质，会回馈给我们能够吸收利用的营养物质作为“房租”，包括维生素K、维生素B族、氨基酸、无机盐等。
                        因此人和有益菌可以互助互惠、和谐共生。而当人体肠道菌群失衡，往往会因为缺乏这些必合成营养素 须营养素，而导致严重的代谢性疾病发生。</p>
                    </div>
                    <div className='know-effect-item'>
                        <div>调节免疫系统</div>
                        <p>肠道不只负责着几乎所有营养的消化吸收还肩负着人体70%以上的免疫功能。
                        一方面，大量的菌群黏附在肠壁上，为肠道穿上了一层天然的铠甲，避免肠壁与有害物质直接接触，起到免疫屏障的作用。
                        另一方面，共生菌群会与肠道的免疫系统形成互动，刺激后者的发育，使肠道应对致病微生物的“反导系统”更加强大。</p>
                    </div>
                    <div className='know-effect-item'>
                        <div>消化食物成分</div>
                        <p>肠道菌群可以分泌一系列的酶协助人体消化自身不能消化的复杂碳水化合物，如纤维素，木聚糖，菊粉和果胶等，为机体提供能量。</p>
                    </div>
                    <div className='know-effect-item'>
                        <div>生物拮抗作用</div>
                        <p>我们肠道内适合细菌定植的空间和营养都是有限的，如果有益菌可以抢先占领肠黏膜上的定植位点，消耗营养，与肠黏膜很好的结合，
                        就能起到一种生物屏障的作用，让肠道菌群内的“墙头草”条件致病菌难以定植和生长，同时抑制外来的致病菌通过肠黏膜入侵和扩散到人体各系统和器官。</p>
                    </div>
                    <div className='know-effect-item'>
                        <div>调节全身器官</div>
                        <p>肠道菌群的影响力可不仅仅局限于我们的消化系统，它们还能通过各种代谢产物，比如脂多糖、胆汁酸、短链脂肪酸等，
                        这些代谢产物进入血液循环后就成为了信使，帮助肠道菌群和全身各器官建立联系，包括肠-脑轴，肠-肝轴，肠-肾轴等，从而持续不断的在我们全身产生作用。</p>
                    </div>
                </div>
                <div className='know-title-sm'>04. 肠道菌群失衡</div>
                <div className='know-balance'>
                    <img _src='img/knowledge/know-balance.png' />
                </div>
                <div className='know-title-sm'>05. 肠道菌群改善方法</div>
                <div className='know-method'>
                    <div className='know-method-item know-method-item-one'>
                        <div>
                            <p className='know-method-title'>益生菌定义</p>
                            <p className='know-content'>世界卫生组织将益生菌定义为：含有生理活性的活菌，当被机体经过口服或其他给药方式摄入适当数量后，
                            能够定殖于宿主并改善宿主微生态平衡，从而发挥有益作用。常见的研究最多、最成熟的两类益生菌是双歧杆菌和乳酸杆菌。</p>
                        </div>
                        <div>
                            <p className='know-method-title'>益生菌的功效</p>
                            <div className='know-method-list'>
                                <div>
                                    <p>促进消化</p>
                                    <p className='know-content'>益生菌能够帮助促进肠胃的蠕动，提高肠胃的消化和吸收功能，大大提高食物的分解吸收率，能够很好的改善消化不良的情况。</p>
                                </div>
                                <div>
                                    <p>合成多种营养元素</p>
                                    <p className='know-content'>益生菌不仅可以合成多种维生素，其代谢产生的酸可以帮助钙铁吸收，促进健康。</p>
                                </div>
                                <div>
                                    <p>提高免疫力</p>
                                    <p className='know-content'>肠道作为人体免疫系统的调节器官，有着非常重要的作用。益生菌能够刺激人体免疫系统，增强免疫系统的功能，预防疾病的发生。</p>
                                </div>
                                <div>
                                    <p>防治便秘，改善皮肤</p>
                                    <p className='know-content'>益生菌促进肠道蠕动、促排便、增加粪便柔软度和量，通过防治便秘起到“排毒”的效果。</p>
                                </div>
                                <div>
                                    <p>控制体重，预防疾病</p>
                                    <p className='know-content'>益生菌可以帮助消化体内多余的糖分，避免过多的糖分转化为脂肪，控制体重；另外，益生菌还可以降低肠道低度炎症，预防肥胖，同时还能预防三高等疾病。</p>
                                </div>
                                <div>
                                    <p>促进肠道平衡，维护肠道年轻</p>
                                    <p className='know-content'>益生菌可以粘附在肠道黏膜上形成一层保护膜，抑制病原菌的定植和生长。研究表明，益生菌在肠道内所占比例越高，肠道功能越健全，肠道就越年轻。而肠道年轻是人体年轻的基础。</p>
                                </div>
                            </div>
                            <p className='know-method-title'>如何选择益生菌</p>
                            <div className='know-method-list'>
                                <div>
                                    <p>用温度应低于体温(37°C)</p>
                                    <p className='know-content'>服用时不要加热，以免活菌被杀死。粉剂可冲入不超过80ml凉水，也可以倒入口中; </p>
                                </div>
                                <div>
                                    <p>最好饭后20分钟后服用</p>
                                    <p className='know-content'>饭后胃酸大量分泌，但食物可消耗大部分胃酸，更有利于让大部分益生菌活着到达肠道发挥作用;</p>
                                </div>
                                <div>
                                    <p>建议益生菌与益生元合用，效果最佳</p>
                                    <p className='know-content'>益生元可为肠道益生菌提供能量，促其迅速增殖，使益生效果更好更有保障;</p>
                                </div>
                                <div>
                                    <p>避免与抗生素一起服用</p>
                                    <p className='know-content'>抗生素不仅会杀死有害菌也会杀死益生菌，因此若使用抗生素需间隔2-4小时后服用;</p>
                                </div>
                                <div>
                                    <p>坚持服用12周以上会有较明显的效果</p>
                                    <p className='know-content'>服用初期症状未见明显改善属于正常现象，应坚持服用12周以后症状才有明显改善，如巩固效果最好连续服用半年以上，并在之后保持良好均衡的饮食及生活习惯。</p>
                                </div>
                                <div>
                                    <p>促进肠道平衡，维护肠道年轻</p>
                                    <p className='know-content'>益生菌可以粘附在肠道黏膜上形成一层保护膜，抑制病原菌的定植和生长。研究表明，益生菌在肠道内所占比例越高，肠道功能越健全，肠道就越年轻。而肠道年轻是人体年轻的基础。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='know-method-item know-method-item-two'>
                        <div>
                            <p className='know-method-title'>益生元定义</p>
                            <p className='know-content'>益生元又称益生菌的食物，是指能够选择性地刺激肠道内一种或几种有益菌的活性或生长繁殖，而对寄主产生有益的影响，从而改善寄主健康的物质。它们是只有好细菌才喜欢吃的膳食纤维。坏细菌非常讨厌它，即使吃了它也造不出有害物质来。
                            而好的细菌吃了益生元则能够不断壮大，在和坏细菌的斗争中抢下更多地盘。
                            目前常见的益生元主要有低聚糖，包括菊糖、低聚果糖、低聚半乳糖、大豆低聚糖、乳果糖等。</p>
                            <div className='know-method-intestine'>
                                <div>
                                    <img src={intestineOne} alt='不被小肠吸收' />
                                    <p>益生元进入小肠不吸收</p>
                                </div>
                                <div>
                                    <img src={intestineTwo} alt='促进益生菌生长' />
                                    <p>益生元成为益生菌的食物经过发酵促进益生菌生长</p>
                                </div>
                                <div>
                                    <img src={intestineThree} alt='增强免疫力' />
                                    <p>益生菌生长改善肠道代谢环境有助于增强机体免疫力</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='know-method-title'>益生元服用注意事项</p>
                            <p>搭配益生菌一起服用</p><p>搭配多种益生元组合食用</p>
                        </div>
                    </div>
                    <div className='know-method-item know-method-item-three'>
                        <table>
                            <thead className='know-method-table-head'>
                                <tr>
                                    <th>功效</th><th>菌株</th><th>临床研究</th>
                                </tr>
                            </thead>
                            <tbody className='know-method-table-body'>
                                <tr>
                                    <td>改善腹泻</td><td>动物双歧杆菌BB-12、动物双歧杆菌B94、嗜热链球菌St21</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>提高免疫力</td><td>嗜酸性乳杆菌NCFM，乳双歧杆菌Bi-07</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>防治便秘</td><td>乳双歧杆菌HN019、动物双歧杆菌BB-12</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>控制体重</td><td>乳双歧杆菌HN019、干酪乳杆菌LC11、两歧双歧杆菌Bb06</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>促进肠道平衡</td><td>副干酪乳杆菌Lpc37、鼠李糖乳杆菌LGG、长双歧杆菌R1075</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>改善过敏</td><td>鼠李糖乳杆菌HN001、鼠李糖乳杆菌LGG、短双歧杆菌MV-16</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>改善情绪</td><td>瑞士乳杆菌R52，植物乳杆菌R1012，长双歧杆菌R1075</td><td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PDF;