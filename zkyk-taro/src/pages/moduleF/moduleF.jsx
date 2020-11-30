import React from 'react';
import { View, Text, Image } from '@tarojs/components';

import './moduleF.css';
import { imgSrc } from '../../config';

const ModuleF = () => {
    const balance = imgSrc + '/icons/know/know-balance.png';
    const intestineOne = imgSrc + '/icons/know/know-intestine-one.svg';
    const intestineTwo = imgSrc + '/icons/know/know-intestine-two.svg';
    const intestineThree = imgSrc + '/icons/know/know-intestine-three.svg';

    return (
        <View className='M-container'>
            <View className='know-title'><Text className='text'>肠道菌群知识科普</Text></View>
            <View className='know-title-sm'>01. 肠道菌群是什么</View>
            <View className='know-what know-contents'>
                <View className='know-what-content'>肠道不仅是我们人体最大的消化器官，也是人体最大的免疫器官，人体约99%的营养素和90%的毒素要在肠道中吸收和排出。
                并且，肠道附着和集结了人体70%以上的免疫功能，产生约80%的抵抗力。
                因此肠健康才能常健康。在人体的肠道内，大约存活有1000种细菌，总体数量在10 上，其数量是人体细胞的10倍，基因数是人类本身基因数的100倍，
                被称为“人类第二个基因组”，编码着我们的健康。这些寄居在肠道内的菌群即为肠道菌群。</View>
            </View>
            <View className='know-title-sm'>02. 肠道菌群有哪些</View>
            <View className='know-which know-contents'>
                <View>根据其在肠道内不同的生理功能以及对人体健康的影响，肠道菌群可被分为三大类：</View>
                <View className='know-which-item'>
                    <View className='title'>有益菌</View>
                    <View className='content'>有益菌，也被称为益生菌，它们与人体是互惠互利的共生关系。
                    有益菌就像卫士守护家园一样，守护我们的肠道健康，具有抑制有害细菌的增长、增强肠道免疫力、维持肠道微生态平衡等多种生理功能
                    ，比如我们耳熟能详的双歧杆菌、乳酸杆菌，就是有益菌的代表。</View>
                </View>
                <View className='know-which-item'>
                    <View className='title'>中性菌</View>
                    <View className='content'>属于肠道菌群中的不稳定因素，它经常伺机而动，如果肠道菌群的平衡被打破，中性菌就发生叛变，
                    加入有害菌的阵营，趁机作乱引发多种疾病，代表比如肠球菌、肠杆菌。</View>
                </View>
                <View className='know-which-item'>
                    <View className='title'>有害菌</View>
                    <View className='content'>一般都是外源过路菌种，一旦数量超过正常水平，会导致腹泻、食物中毒等症状，代表比如沙门氏菌、志贺氏菌等。</View>
                </View>
                <View>正常情况下，我们肠道中有益菌是占绝对优势的，一旦有益菌减少或者有害菌增多，这种生态平衡就会被打破，胃肠道系统的功能就会出现问题。</View>
            </View>
            <View className='know-title-sm'>03. 肠道菌群的作用</View>
            <View className='know-effect know-contents'>
                <View>由于肠道菌群与健康的联系紧密，且具有可调节性，使其在人体健康中扮演的角色越来越重要。肠道菌群与人体健康的贡献主要体现在：</View>
                <View className='know-effect-item'>
                    <View className='title'>合成营养素</View>
                    <View className='content'>肠道菌群可以帮助消化人体自身不能消化的食物成分，合成多种人体必需的营养物质。
                    例如，细菌“吃掉”低聚糖、纤维素等未被人体消化吸收的物质，会回馈给我们能够吸收利用的营养物质作为“房租”，包括维生素K、维生素B族、氨基酸、无机盐等。
                    因此人和有益菌可以互助互惠、和谐共生。而当人体肠道菌群失衡，往往会因为缺乏这些必合成营养素 须营养素，而导致严重的代谢性疾病发生。</View>
                </View>
                <View className='know-effect-item'>
                    <View className='title'>调节免疫系统</View>
                    <View className='content'>肠道不只负责着几乎所有营养的消化吸收还肩负着人体70%以上的免疫功能。
                    一方面，大量的菌群黏附在肠壁上，为肠道穿上了一层天然的铠甲，避免肠壁与有害物质直接接触，起到免疫屏障的作用。
                    另一方面，共生菌群会与肠道的免疫系统形成互动，刺激后者的发育，使肠道应对致病微生物的“反导系统”更加强大。</View>
                </View>
                <View className='know-effect-item'>
                    <View className='title'>消化食物成分</View>
                    <View className='content'>肠道菌群可以分泌一系列的酶协助人体消化自身不能消化的复杂碳水化合物，如纤维素，木聚糖，菊粉和果胶等，为机体提供能量。</View>
                </View>
                <View className='know-effect-item'>
                    <View className='title'>生物拮抗作用</View>
                    <View className='content'>我们肠道内适合细菌定植的空间和营养都是有限的，如果有益菌可以抢先占领肠黏膜上的定植位点，消耗营养，与肠黏膜很好的结合，
                    就能起到一种生物屏障的作用，让肠道菌群内的“墙头草”条件致病菌难以定植和生长，同时抑制外来的致病菌通过肠黏膜入侵和扩散到人体各系统和器官。</View>
                </View>
                <View className='know-effect-item'>
                    <View className='title'>调节全身器官</View>
                    <View className='content'>肠道菌群的影响力可不仅仅局限于我们的消化系统，它们还能通过各种代谢产物，比如脂多糖、胆汁酸、短链脂肪酸等，
                    这些代谢产物进入血液循环后就成为了信使，帮助肠道菌群和全身各器官建立联系，包括肠-脑轴，肠-肝轴，肠-肾轴等，从而持续不断的在我们全身产生作用。</View>
                </View>
            </View>
            <View className='know-title-sm'>04. 肠道菌群失衡</View>
            <View className='know-balance know-contents'>
                <Image className='img' src={balance} />
            </View>
            <View className='know-title-sm'>05. 肠道菌群改善方法</View>
            <View className='know-method know-contents'>
                <View className='know-method-item know-method-item-one'>
                    <View>
                        <View className='know-method-title'>益生菌定义</View>
                        <View className='know-content'>世界卫生组织将益生菌定义为：含有生理活性的活菌，当被机体经过口服或其他给药方式摄入适当数量后，
                        能够定殖于宿主并改善宿主微生态平衡，从而发挥有益作用。常见的研究最多、最成熟的两类益生菌是双歧杆菌和乳酸杆菌。</View>
                    </View>
                    <View>
                        <View className='know-method-title'>益生菌的功效</View>
                        <View className='know-method-list'>
                            <View>
                                <View className='title'>促进消化</View>
                                <View className='know-content'>益生菌能够帮助促进肠胃的蠕动，提高肠胃的消化和吸收功能，大大提高食物的分解吸收率，能够很好的改善消化不良的情况。</View>
                            </View>
                            <View>
                                <View className='title'>合成多种营养元素</View>
                                <View className='know-content'>益生菌不仅可以合成多种维生素，其代谢产生的酸可以帮助钙铁吸收，促进健康。</View>
                            </View>
                            <View>
                                <View className='title'>提高免疫力</View>
                                <View className='know-content'>肠道作为人体免疫系统的调节器官，有着非常重要的作用。益生菌能够刺激人体免疫系统，增强免疫系统的功能，预防疾病的发生。</View>
                            </View>
                            <View>
                                <View className='title'>防治便秘，改善皮肤</View>
                                <View className='know-content'>益生菌促进肠道蠕动、促排便、增加粪便柔软度和量，通过防治便秘起到“排毒”的效果。</View>
                            </View>
                            <View>
                                <View className='title'>控制体重，预防疾病</View>
                                <View className='know-content'>益生菌可以帮助消化体内多余的糖分，避免过多的糖分转化为脂肪，控制体重；另外，益生菌还可以降低肠道低度炎症，预防肥胖，同时还能预防三高等疾病。</View>
                            </View>
                            <View>
                                <View className='title'>促进肠道平衡，维护肠道年轻</View>
                                <View className='know-content'>益生菌可以粘附在肠道黏膜上形成一层保护膜，抑制病原菌的定植和生长。研究表明，益生菌在肠道内所占比例越高，肠道功能越健全，肠道就越年轻。而肠道年轻是人体年轻的基础。</View>
                            </View>
                        </View>
                        <View className='know-method-title'>如何让选择益生菌</View>
                        <View className='know-method-list'>
                            <View>
                                <View className='title'>用温度应低于体温(37°C)</View>
                                <View className='know-content'>服用时不要加热，以免活菌被杀死。粉剂可冲入不超过80ml凉水，也可以倒入口中; </View>
                            </View>
                            <View>
                                <View className='title'>最好饭后20分钟后服用</View>
                                <View className='know-content'>饭后胃酸大量分泌，但食物可消耗大部分胃酸，更有利于让大部分益生菌活着到达肠道发挥作用;</View>
                            </View>
                            <View>
                                <View className='title'>建议益生菌与益生元合用，效果最佳</View>
                                <View className='know-content'>益生元可为肠道益生菌提供能量，促其迅速增殖，使益生效果更好更有保障;</View>
                            </View>
                            <View>
                                <View className='title'>避免与抗生素一起服用</View>
                                <View className='know-content'>抗生素不仅会杀死有害菌也会杀死益生菌，因此若使用抗生素需间隔2-4小时后服用;</View>
                            </View>
                            <View>
                                <View className='title'>坚持服用12周以上会有较明显的效果</View>
                                <View className='know-content'>服用初期症状未见明显改善属于正常现象，应坚持服用12周以后症状才有明显改善，如巩固效果最好连续服用半年以上，并在之后保持良好均衡的饮食及生活习惯。</View>
                            </View>
                            <View>
                                <View className='title'>促进肠道平衡，维护肠道年轻</View>
                                <View className='know-content'>益生菌可以粘附在肠道黏膜上形成一层保护膜，抑制病原菌的定植和生长。研究表明，益生菌在肠道内所占比例越高，肠道功能越健全，肠道就越年轻。而肠道年轻是人体年轻的基础。</View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='know-method-item know-method-item-two'>
                    <View>
                        <View className='know-method-title'>益生元定义</View>
                        <View className='know-content'>益生元又称益生菌的食物，是指能够选择性地刺激肠道内一种或几种有益菌的活性或生长繁殖，而对寄主产生有益的影响，从而改善寄主健康的物质。它们是只有好细菌才喜欢吃的膳食纤维。坏细菌非常讨厌它，即使吃了它也造不出有害物质来。
                        而好的细菌吃了益生元则能够不断壮大，在和坏细菌的斗争中抢下更多地盘。
                        目前常见的益生元主要有低聚糖，包括菊糖、低聚果糖、低聚半乳糖、大豆低聚糖、乳果糖等。</View>
                        <View className='know-method-intestine'>
                            <View className='item'>
                                <Image className='img' src={intestineOne} alt='不被小肠吸收' />
                                <View className='content'>益生元进入小肠不吸收</View>
                            </View>
                            <View className='item'>
                                <Image className='img' src={intestineTwo} alt='促进益生菌生长' />
                                <View className='content'>益生元成为益生菌的食物经过发酵促进益生菌生长</View>
                            </View>
                            <View className='item'>
                                <Image className='img' src={intestineThree} alt='增强免疫力' />
                                <View className='content'>益生菌生长改善肠道代谢环境有助于增强机体免疫力</View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View className='know-method-title'>益生元服用注意事项</View>
                        <View className='know-method-care'>搭配益生菌一起服用、搭配多种益生元组合食用</View>
                    </View>
                </View>
                <View className='know-method-item know-method-item-three'>
                    <View className='table'>
                        <View className='thead know-method-table-head'>
                            <View className='tr'>
                                <View className='td'>功效</View><View className='td'>菌株</View><View className='td'>临床研究</View>
                            </View>
                        </View>
                        <View className='tbody know-method-table-body'>
                            <View className='tr'>
                                <View className='td'>改善腹泻</View><View className='td'>动物双歧杆菌BB-12、动物双歧杆菌B94、嗜热链球菌St21</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>提高免疫力</View><View className='td'>嗜酸性乳杆菌NCFM，乳双歧杆菌Bi-07</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>防治便秘</View><View className='td'>乳双歧杆菌HN019、动物双歧杆菌BB-12</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>控制体重</View><View className='td'>乳双歧杆菌HN019、干酪乳杆菌LC11、两歧双歧杆菌Bb06</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>促进肠道平衡</View><View className='td'>副干酪乳杆菌Lpc37、鼠李糖乳杆菌LGG、长双歧杆菌R1075</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>改善过敏</View><View className='td'>鼠李糖乳杆菌HN001、鼠李糖乳杆菌LGG、短双歧杆菌MV-16</View><View className='td'>-</View>
                            </View>
                            <View className='tr'>
                                <View className='td'>改善情绪</View><View className='td'>瑞士乳杆菌R52，植物乳杆菌R1012，长双歧杆菌R1075</View><View className='td'>-</View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ModuleF;