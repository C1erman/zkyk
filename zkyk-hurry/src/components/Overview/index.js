import React, { useEffect, useState } from 'react';
import F2 from '@antv/f2';
import './overview.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector } from 'react-redux';
import Progress from '../Progress';

const showGraph = () => {
    const {
    Shape,
    G,
    Util,
    Global
    } = F2;
    const Vector2 = G.Vector2;
    Shape.registerShape('interval', 'polar-tick', {
    draw: function draw(cfg, container) {
        const points = this.parsePoints(cfg.points);
        const style = Util.mix({
        stroke: cfg.color
        }, Global.shape.interval, cfg.style);
    
        let newPoints = points.slice(0);
        if (this._coord.transposed) {
        newPoints = [ points[0], points[3], points[2], points[1] ];
        }
    
        const center = cfg.center;
        const x = center.x,
        y = center.y;
    
    
        const v = [ 1, 0 ];
        const v0 = [ newPoints[0].x - x, newPoints[0].y - y ];
        const v1 = [ newPoints[1].x - x, newPoints[1].y - y ];
        const v2 = [ newPoints[2].x - x, newPoints[2].y - y ];
    
        let startAngle = Vector2.angleTo(v, v1);
        let endAngle = Vector2.angleTo(v, v2);
        const r0 = Vector2.length(v0);
        const r = Vector2.length(v1);
    
        if (startAngle >= 1.5 * Math.PI) {
        startAngle = startAngle - 2 * Math.PI;
        }
    
        if (endAngle >= 1.5 * Math.PI) {
        endAngle = endAngle - 2 * Math.PI;
        }
    
        const lineWidth = r - r0;
        const newRadius = r - lineWidth / 2;
    
        return container.addShape('Arc', {
        className: 'interval',
        attrs: Util.mix({
            x,
            y,
            startAngle,
            endAngle,
            r: newRadius,
            lineWidth,
            lineCap: 'round'
        }, style)
        });
    }
    });
    const data = [{
    const: 'a',
    actual: 75,
    expect: 100
    }];
    const chart = new F2.Chart({
    id: 'graph',
    padding: [ 0, 30, 60 ],
    pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
    actual: {
        max: 100,
        min: 0,
        nice: false
    }
    });
    chart.coord('polar', {
    transposed: true,
    innerRadius: 0.8,
    startAngle: -Math.PI,
    endAngle: 0
    });
    chart.axis(false);
    chart.interval()
    .position('const*expect')
    .shape('polar-tick')
    .size(10)
    .color('rgba(80, 143, 255, 0.95)')
    .animate(false); // 背景条
    chart.interval()
    .position('const*actual')
    .shape('polar-tick')
    .size(10)
    .color('#fff')
    .animate({
        appear: {
        duration: 1100,
        easing: 'linear',
        animation: function animation(shape, animateCfg) {
            const startAngle = shape.attr('startAngle');
            let endAngle = shape.attr('endAngle');
            if (startAngle > endAngle) {
            // -Math.PI/2 到 0
            endAngle += Math.PI * 2;
            }
            shape.attr('endAngle', startAngle);
            shape.animate().to(Util.mix({
            attrs: {
                endAngle
            }
            }, animateCfg)).onUpdate(function(frame) {
            const textEl = document.querySelector('#text');
            if (textEl) textEl.innerHTML = parseInt(frame * 75) + '分';
            });
        }
        }
    }); // 实际进度
    chart.guide().html({
    position: [ '50%', '80%' ],
    html: `
        <div style="width: 120px;color: #fff;white-space: nowrap;text-align:center;">
            <p style="font-size: 18px;margin:0;">中度失调</p>
            <p id="text" style="font-size: 48px;margin:0;font-weight: bold;"></p>
        </div>`
    });
    chart.render();
}

const Overview = () => {
    let [user, setUser] = useState({});
    let [flora, setFlora] = useState([]);
    let [result, setResult] = useState([]);
    let [abnormal, setAbnormal] = useState([]);

    let report = useSelector(state => state.report);

    useEffect(() => {
        showGraph();
        // 模块 A
        Axios({
            method : 'GET',
            url : host + '/sample/personal',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setUser(data.data);
        }).catch(error => setUser([]));
        // 异常部分
        Axios({
            method : 'GET',
            url : host + '/sample/abnormal',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setResult(data.data);
        }).catch(error => console.log(''));
        // 模块 B
        Axios({
            method : 'GET',
            url : host + '/sample/metrics',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setFlora(data.data);
        }).catch(error => setFlora([]));
        // 模块 E
        Axios({
            method : 'GET',
            url : host + '/sample/bacteria',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setResult(data.data);
        }).catch(error => setResult([]));
        

    }, [])
    const judgeRange = (value, min, max) =>{
        if(value < min) {
            return { className : 'overview-result-below' }
        }
        else if(value > max) {
            return { className : 'overview-result-above' }
        }
    }

    return (
        <div className='overview-container'>
            <div className='overview-total-graph'>
                <canvas id='graph' />
            </div>
            <div className='overview-title'><span>整体情况</span></div>
            <div className='overview-total'>
                <div>
                    <span className='overview-total-label'>受检者<span>{user.name}</span></span>
                    <span className='overview-total-label'>性别<span>{user.gender}</span></span>
                </div>
                <div>
                    <span className='overview-total-label'>出生日期<span>{user.birthday}</span></span>
                    <span className='overview-total-label'>报告日期<span>{user.date_of_production}</span></span>
                </div>
            </div>
            <div className='overview-title'><span>菌群状态分析</span></div>
            <div className='overview-flora'>
                {flora.map((v, i) => (
                    <div key={i} className='overview-flora-items'>
                        <div className='overview-flora-item-header'>
                            <div>{v.type_zh}</div><div>{v.rank_zh}</div>
                        </div>
                        <div className='overview-flora-item-body'>
                            <div>{v.summary}</div>
                            {v.chart ? (
                                <div className='overview-flora-item-progress'>
                                    {v.chart.map((v, i) => (
                                        <Progress key={i} label={v.name} color='#ff4f76' percent='80%' />
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div className='overview-flora-item-result'>
                            {/* <div>结果评价：</div> */}
                            {v.suggestion}
                        </div>
                    </div>
                ))}
            </div>
            <div className='overview-title'><span>具体检测结果</span></div>
            <div className='overview-result'>
                <div className='overview-result-info'>* 红色表示该菌含量异常，对健康有影响</div>
                <table>
                    <thead>
                        <tr className='overview-result-table-head'>
                            <th>名称</th><th>受检者检测数值<br />（Lg CFU/g）</th><th>参考范围<br />（Lg CFU/g）</th>
                        </tr>
                    </thead>
                    <tbody className='overview-result-table-body'>
                        {result.length ? result.map(v => (
                            <tr key={v.name}>
                                <td className='overview-result-table-name'>{v.name}</td><td {...judgeRange(v.value, v.range_up, v.range_down)}>{v.value}</td><td>{v.range_up} - {v.range_down}</td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Overview;