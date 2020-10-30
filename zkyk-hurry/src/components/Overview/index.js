import React, { useEffect, useState } from 'react';
// import F2 from '@antv/f2';
// import { Chart, registerShape } from '@antv/g2';
import './overview.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector, useDispatch } from 'react-redux';
import Progress from '../Progress';
import { slideUp } from '../../utils/slideUp';
import { useHistory } from 'react-router-dom';
import * as BIO from '../../actions';
import Alert from '../Alert';

// const showGraph = (label = '健康', score = 100) => {
//     const {
//         Shape,
//         G,
//         Util,
//         Global
//     } = F2;
//     const Vector2 = G.Vector2;
//     Shape.registerShape('interval', 'polar-tick', {
//         draw: function draw(cfg, container) {
//             const points = this.parsePoints(cfg.points);
//             const style = Util.mix({
//                 stroke: cfg.color
//             }, Global.shape.interval, cfg.style);

//             let newPoints = points.slice(0);
//             if (this._coord.transposed) {
//                 newPoints = [points[0], points[3], points[2], points[1]];
//             }
//             const center = cfg.center;
//             const x = center.x,
//                 y = center.y;

//             const v = [1, 0];
//             const v0 = [newPoints[0].x - x, newPoints[0].y - y];
//             const v1 = [newPoints[1].x - x, newPoints[1].y - y];
//             const v2 = [newPoints[2].x - x, newPoints[2].y - y];

//             let startAngle = Vector2.angleTo(v, v1);
//             let endAngle = Vector2.angleTo(v, v2);
//             const r0 = Vector2.length(v0);
//             const r = Vector2.length(v1);

//             if (startAngle >= 1.5 * Math.PI) {
//                 startAngle = startAngle - 2 * Math.PI;
//             }

//             if (endAngle >= 1.5 * Math.PI) {
//                 endAngle = endAngle - 2 * Math.PI;
//             }

//             const lineWidth = r - r0;
//             const newRadius = r - lineWidth / 2;

//             return container.addShape('Arc', {
//                 className: 'interval',
//                 attrs: Util.mix({
//                     x,
//                     y,
//                     startAngle,
//                     endAngle,
//                     r: newRadius,
//                     lineWidth,
//                     lineCap: 'round'
//                 }, style)
//             });
//         }
//     });
//     const data = [{
//         const: 'a',
//         actual: score,
//         expect: 100
//     }];
//     const chart = new F2.Chart({
//         id: 'graph',
//         padding: [0, 30, 60],
//         pixelRatio: window.devicePixelRatio
//     });
//     chart.source(data, {
//         actual: {
//             max: 100,
//             min: 0,
//             nice: false
//         }
//     });
//     chart.coord('polar', {
//         transposed: true,
//         innerRadius: 0.8,
//         startAngle: -Math.PI,
//         endAngle: 0
//     });
//     chart.axis(false);
//     chart.interval()
//         .position('const*expect')
//         .shape('polar-tick')
//         .size(10)
//         .color('#ffa6ba')
//         .animate(false); // 背景条
//     chart.interval()
//         .position('const*actual')
//         .shape('polar-tick')
//         .size(10)
//         .color('#fff')
//         .animate({
//             appear: {
//                 duration: 1100,
//                 easing: 'linear',
//                 animation: function animation(shape, animateCfg) {
//                     const startAngle = shape.attr('startAngle');
//                     let endAngle = shape.attr('endAngle');
//                     if (startAngle > endAngle) {
//                         // -Math.PI/2 到 0
//                         endAngle += Math.PI * 2;
//                     }
//                     shape.attr('endAngle', startAngle);
//                     shape.animate().to(Util.mix({
//                         attrs: {
//                             endAngle
//                         }
//                     }, animateCfg)).onUpdate(function (frame) {
//                         const textEl = document.querySelector('#text');
//                         if (textEl) textEl.innerHTML = parseInt(frame * (score)) + '分';
//                     });
//                 }
//             }
//         });
//     // 实际进度
//     chart.guide().html({
//         position: ['50%', '80%'],
//         html: `
//         <div style="width: 120px;color: #fff;white-space: nowrap;text-align:center;">
//             <p style="font-size: 18px;margin:0;">${label}</p>
//             <p id="text" style="font-size: 48px;margin:0;font-weight: bold;"></p>
//         </div>`
//     });
//     chart.render();
// }
const showGraphNew = (label = '健康', score = 9) => {
    // 自定义Shape 部分
    G2.registerShape('point', 'pointer', {
        draw(cfg, container) {
            const group = container.addGroup({});
            // 获取极坐标系下画布中心点
            const center = this.parsePoint({ x: 0, y: 0 });
            // 绘制指针
            group.addShape('line', {
                attrs: {
                    x1: center.x,
                    y1: center.y,
                    x2: cfg.x,
                    y2: cfg.y,
                    stroke: cfg.color,
                    lineWidth: 5,
                    lineCap: 'round',
                },
            });
            group.addShape('circle', {
                attrs: {
                    x: center.x,
                    y: center.y,
                    r: 9.75,
                    stroke: cfg.color,
                    lineWidth: 4.5,
                    fill: '#fff',
                },
            });
            return group;
        },
    });
    const data = [{ value: score }];
    const chart = new G2.Chart({
        container: 'graph',
        autoFit: true,
        height: 250,
        padding: [0, 0, 30, 0],
    });
    chart.data(data);
    chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.85,
    });
    chart.scale('value', {
        min: 0,
        max: 10,
        ticks: [2, 4, 5, 6, 7, 8, 9],
    });
    chart.axis('1', false);
    chart.axis('value', {
        line: null,
        label: {
            offset: -35,
            formatter: (val) => {
                if (val === '2') {
                    return '重度';
                } else if (val === '4') {
                    return '40'
                } else if (val === '5') {
                    return '中度';
                } else if (val === '7') {
                    return '轻度';
                } else if (val === '9') {
                    return '健康'
                } else if (val === '6') {
                    return '60'
                } else if (val === '8') {
                    return '80'
                }
                return '';
            },
            style: {
                fill: '#666',
                fontSize: 15,
                textAlign: 'center',
            },
        },
        tickLine: null,
        grid: null,
    });
    chart.legend(false);
    chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('#ff4f76');
    // 绘制仪表盘刻度线
    chart.annotation().line({
        start: [4, 0.96],
        end: [4, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    chart.annotation().line({
        start: [6, 0.96],
        end: [6, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    chart.annotation().line({
        start: [8, 0.96],
        end: [8, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    // 绘制仪表盘背景
    chart.annotation().arc({
        top: false,
        start: [0, 1],
        end: [10, 1],
        style: {
            stroke: '#ffe6eb',
            lineWidth: 13,
            lineDash: null,
        },
    });
    // 绘制指标
    chart.annotation().arc({
        start: [0, 1],
        end: [data[0].value, 1],
        style: {
            stroke: '#ff4f76',
            lineWidth: 13,
            lineDash: null,
        },
    });
    // 绘制指标数字
    chart.annotation().text({
        position: ['50%', '85%'],
        content: label,
        style: {
            fontSize: 15,
            fill: '#ff4f76',
            textAlign: 'center',
        },
    });
    chart.annotation().text({
        position: ['50%', '90%'],
        content: `${data[0].value * 10} 分`,
        style: {
            fontSize: 30,
            fill: '#ff4f76',
            textAlign: 'center',
        },
        offsetY: 15,
    });
    chart.render();
}

const Overview = () => {
    let [user, setUser] = useState({});
    let [flora, setFlora] = useState([]);
    let [result, setResult] = useState([]);
    let [abnormal, setAbnormal] = useState();
    let [graphInfo, setGraphInfo] = useState([]);
    let history = useHistory();
    let report = useSelector(state => state.report);
    let userInfo = useSelector(state => state.user);
    let dispatch = useDispatch();
    let alertController = {};

    useEffect(() => {
        slideUp();
        // 仪表盘部分
        Axios({
            method: 'GET',
            url: host + '/charts/gauge',
            params: {
                id: report.current,
                'access-token': userInfo.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            // if (data.code === 'success') showGraph(data.data.name, + data.data.value);
            if(data.code === 'success') showGraphNew(data.data.name, (+ data.data.value) / 10);
        })
        .catch(error => {
            if(error.response?.status === 500){
                console.log('网络请求出现问题。');
            }else if(error.response?.status === 401){
                alertController.on('toggle');
            }
        });
        Axios({
            method: 'GET',
            url: host + '/sample/contrast',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            params: {
                'access-token': userInfo.token
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setGraphInfo(data.data);
        }).catch(error => setUser([]));
        // 模块 A
        Axios({
            method: 'GET',
            url: host + '/sample/personal',
            params: {
                id: report.current,
                'access-token': userInfo.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setUser(data.data);
        }).catch(error => setUser([]));
        // 异常部分
        Axios({
            method: 'GET',
            url: host + '/sample/abnormal',
            params: {
                id: report.current,
                'access-token': userInfo.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setAbnormal(data.data);
        }).catch(error => console.log(''));
        // 模块 E
        Axios({
            method: 'GET',
            url: host + '/sample/bacteria',
            params: {
                id: report.current,
                'access-token': userInfo.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setResult(data.data);
        }).catch(error => setResult([]));
        // 模块 B
        Axios({
            method: 'GET',
            url: host + '/sample/metrics',
            params: {
                id: report.current,
                'access-token': userInfo.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setFlora(data.data);
        }).catch(error => setFlora([]));
    }, [])
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
    const judgeProgress = (value) => {
        if (value === '偏低') return { className: 'overview-results overview-result-below' };
        else if (value === '偏高') return { className: 'overview-results overview-result-above' };
        else return { className: 'overview-results' }
    }
    const mapBacterialType = (type) => {
        return {
            beneficial: '有益菌',
            general: '中性菌',
            harmful: '有害菌'
        }[type]
    }
    return (
        <div className='overview-container'>
            <div className='overview-title'><span>整体情况</span></div>
            <div className='overview-total-graph'>
                <div id='graph' />
            </div>
            <div className='overview-age-prediction'>预测年龄：{+ user.age}</div>
            <div className='overview-total'>
                <div>
                    <span className='overview-total-label'>受检者<span>{user.name}</span></span>
                    <span className='overview-total-label'>性别<span>{user.gender}</span></span>
                </div>
                <div>
                    <span className='overview-total-label'>生日<span>{user.birthday}</span></span>
                    <span className='overview-total-label'>报告日期<span>{user.date_of_production}</span></span>
                </div>
            </div>
            <div className='overview-abnormal'>
                <div className='overview-abnormal-title'>根据您目前的肠道菌群情况，提示您<span>以下指标异常</span>，需要引起重视，可结合改善建议进行调理。</div>
                {abnormal ? (
                    <div>
                        <div className='overview-abnormal-content'>
                            <div>菌群环境</div>
                            <div className='overview-abnormal-content-item'>
                                {abnormal.metrics.intestinal_defense ? (<div><span className='title'>肠道防御力</span><span>{abnormal.metrics.intestinal_defense}</span></div>) : null}
                                {abnormal.metrics.beneficial ? (<div><span className='title'>有益菌：</span>{abnormal.metrics.beneficial}<span className='item'>偏低</span></div>) : null}
                                {abnormal.metrics.harmful ? (<div><span className='title'>有害菌：</span>{abnormal.metrics.harmful}<span className='item'>超标</span></div>) : null}
                            </div>
                        </div>
                        <div className='overview-abnormal-content'>
                            <div>健康指标</div>
                            <div className='overview-abnormal-content-item'>{abnormal.indicator.map((v, i) => (
                                <div key={i}>{v.type_zh}<span className='item-margin'>{v.rank_zh}</span></div>
                            ))}</div>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className='overview-title'><span>菌群状态分析</span></div>
            <div className='overview-flora'>
                {flora.map((v, i) => (
                    <div key={i} className='overview-flora-items'>
                        <div className='overview-flora-item-header'>
                            <div>{v.type_zh}</div><div className={v.rank_en}>{v.rank_zh}</div>
                        </div>
                        <div className='overview-flora-item-body'>
                            <div>{v.summary}</div>
                            {v.chart ? (
                                <div className='overview-flora-item-progress'>
                                    {v.chart.map((v, i) => (
                                        <Progress key={i} label={<span>{v.name + ' '}<span {...judgeProgress(v.state)}>{v.state}</span></span>} percent={(+ v.proportion) * 100 + '%'} />
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
            <div className='overview-title'><span>具体检测结果</span></div>
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
            <Alert controller={alertController} content='登录凭证过期，请重新登录' beforeClose={() => {
                dispatch({
                    type: BIO.LOGIN_EXPIRED
                });
                history.push('/user/login');
            }} />
        </div>
    );
}

export default Overview;