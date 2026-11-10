window.SHOWCASE = {
  "title": "Real2SimBench",
  "date": "2026-11-10",
  "sceneCount": 8,
  "clipCount": 48,
  "scenes": [
    {
      "id": "R01",
      "group": "rigid",
      "groupLabel": "刚体与关节",
      "name": "重力驱动的物理摆",
      "short": "物理摆",
      "en": "Physical pendulum",
      "topic": "重力与理想铰链",
      "description": "杆与球组成刚体，在重力作用下围绕固定铰点摆动。改变释放角，观察相同物理时刻的摆幅与相位。",
      "engine": "Newton · Featherstone",
      "source": "项目显式构建的杆球组合，使用固定版本 Newton 原生求解器。",
      "url": "https://github.com/newton-physics/newton/tree/1a497c00ed255db343e39eec4d614864c9aa9b95",
      "version": "Newton · 1a497c0",
      "scope": "理想铰接刚体；完整窗口通过独立方程、能量、重复和步长对照。",
      "A": [
        "初始释放角",
        "20°",
        "45°"
      ],
      "E": [
        "重力加速度",
        "9.81 m/s²",
        "4.905 m/s²"
      ],
      "note": "本例 E 为重力场扩展，单独标记，不计入严格的几何／约束 E 集合。",
      "release": "Rigid4_Eval_v2_20261110",
      "fps": 60,
      "interventions": {
        "A": "初始释放角20°改为45°；其余物理设置不变。",
        "E": "重力加速度9.81改为4.905m/s²；这是重力场扩展，不是几何/约束E。"
      },
      "clips": {
        "REF": {
          "src": "media/R01_REF.mp4",
          "poster": "posters/R01_REF.jpg",
          "frames": 241,
          "fps": 60,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.016666666666667
        },
        "T_OBS": {
          "src": "media/R01_T_OBS.mp4",
          "poster": "posters/R01_T_OBS.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "T_FUTURE": {
          "src": "media/R01_T_FUTURE.mp4",
          "poster": "posters/R01_T_FUTURE.jpg",
          "frames": 181,
          "fps": 60,
          "start": 1.0,
          "end": 4.0,
          "encodedDuration": 3.0166666666666666
        },
        "A": {
          "src": "media/R01_A.mp4",
          "poster": "posters/R01_A.jpg",
          "frames": 241,
          "fps": 60,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.016666666666667
        },
        "E": {
          "src": "media/R01_E.mp4",
          "poster": "posters/R01_E.jpg",
          "frames": 241,
          "fps": 60,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.016666666666667
        },
        "V": {
          "src": "media/R01_V.mp4",
          "poster": "posters/R01_V.jpg",
          "frames": 241,
          "fps": 60,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.016666666666667
        }
      },
      "duration": 4.0,
      "cut": 1.0
    },
    {
      "id": "R02",
      "group": "rigid",
      "groupLabel": "刚体与关节",
      "name": "斜面上的摩擦滑块",
      "short": "摩擦斜面",
      "en": "Friction ramp",
      "topic": "库仑摩擦与运动反向",
      "description": "物块沿有摩擦的斜面运动。向上的初速度先被重力和摩擦减小，停下后再沿斜面回滑。",
      "engine": "Newton · XPBD",
      "source": "固定 Newton 官方摩擦测试的单个单元；细化数值步长的派生版。",
      "url": "https://github.com/newton-physics/newton/tree/1a497c00ed255db343e39eec4d614864c9aa9b95",
      "version": "Newton · 1a497c0",
      "scope": "原生摩擦接触轨迹；上滑距离、下滑加速度与静止阈值有独立解析核验。",
      "A": [
        "沿坡向上的初速度",
        "0 m/s",
        "3 m/s"
      ],
      "E": [
        "斜面倾角",
        "30°",
        "10°"
      ],
      "note": "A 的上滑发生在开头约 0.33 秒，沿坡约 0.49 米；可用 ¼ 速观察。",
      "release": "Rigid4_Eval_v2_20261110",
      "fps": 60,
      "interventions": {
        "A": "只增加沿坡面向上3m/s的初速度；上滑在开头约0.33秒，随后反向下滑。",
        "E": "坡度30°改为10°，按同一源规则保持滑块相对坡面的初始放置。"
      },
      "clips": {
        "REF": {
          "src": "media/R02_REF.mp4",
          "poster": "posters/R02_REF.jpg",
          "frames": 121,
          "fps": 60,
          "start": 0.0,
          "end": 2.0,
          "encodedDuration": 2.0166666666666666
        },
        "T_OBS": {
          "src": "media/R02_T_OBS.mp4",
          "poster": "posters/R02_T_OBS.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "T_FUTURE": {
          "src": "media/R02_T_FUTURE.mp4",
          "poster": "posters/R02_T_FUTURE.jpg",
          "frames": 61,
          "fps": 60,
          "start": 1.0,
          "end": 2.0,
          "encodedDuration": 1.0166666666666666
        },
        "A": {
          "src": "media/R02_A.mp4",
          "poster": "posters/R02_A.jpg",
          "frames": 121,
          "fps": 60,
          "start": 0.0,
          "end": 2.0,
          "encodedDuration": 2.0166666666666666
        },
        "E": {
          "src": "media/R02_E.mp4",
          "poster": "posters/R02_E.jpg",
          "frames": 121,
          "fps": 60,
          "start": 0.0,
          "end": 2.0,
          "encodedDuration": 2.0166666666666666
        },
        "V": {
          "src": "media/R02_V.mp4",
          "poster": "posters/R02_V.jpg",
          "frames": 121,
          "fps": 60,
          "start": 0.0,
          "end": 2.0,
          "encodedDuration": 2.0166666666666666
        }
      },
      "duration": 2.0,
      "cut": 1.0
    },
    {
      "id": "R03",
      "group": "rigid",
      "groupLabel": "刚体与关节",
      "name": "双球的弹性碰撞",
      "short": "双球碰撞",
      "en": "Elastic impact",
      "topic": "动量交换与反弹",
      "description": "两个等质量球在零重力、无摩擦的条件下碰撞。观察正碰、斜碰，以及固定挡墙带来的反弹和再次相撞。",
      "engine": "Newton · XPBD",
      "source": "项目显式设置双球初态，使用固定 Newton 原生恢复系数求解器。",
      "url": "https://github.com/newton-physics/newton/tree/1a497c00ed255db343e39eec4d614864c9aa9b95",
      "version": "Newton · 1a497c0",
      "scope": "理想完全弹性球；解析轨迹、事件时间、能量、动量、重复和半步长检查。",
      "A": [
        "入射球初始横向偏移",
        "0 m",
        "+0.35 m"
      ],
      "E": [
        "右侧运动边界",
        "无挡墙",
        "x = 1.5 m 固定墙"
      ],
      "note": "地面网格是显示参照。物理模型为零重力双球，不含地面摩擦。",
      "release": "Rigid4_Eval_v2_20261110",
      "fps": 60,
      "interventions": {
        "A": "只将橙色入射球初始y坐标0改为+0.35m，形成斜碰。",
        "E": "只增加内表面x=1.5m的固定弹性挡墙，产生反弹及再次碰撞。"
      },
      "clips": {
        "REF": {
          "src": "media/R03_REF.mp4",
          "poster": "posters/R03_REF.jpg",
          "frames": 181,
          "fps": 60,
          "start": 0.0,
          "end": 3.0,
          "encodedDuration": 3.0166666666666666
        },
        "T_OBS": {
          "src": "media/R03_T_OBS.mp4",
          "poster": "posters/R03_T_OBS.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "T_FUTURE": {
          "src": "media/R03_T_FUTURE.mp4",
          "poster": "posters/R03_T_FUTURE.jpg",
          "frames": 121,
          "fps": 60,
          "start": 1.0,
          "end": 3.0,
          "encodedDuration": 2.0166666666666666
        },
        "A": {
          "src": "media/R03_A.mp4",
          "poster": "posters/R03_A.jpg",
          "frames": 181,
          "fps": 60,
          "start": 0.0,
          "end": 3.0,
          "encodedDuration": 3.0166666666666666
        },
        "E": {
          "src": "media/R03_E.mp4",
          "poster": "posters/R03_E.jpg",
          "frames": 181,
          "fps": 60,
          "start": 0.0,
          "end": 3.0,
          "encodedDuration": 3.0166666666666666
        },
        "V": {
          "src": "media/R03_V.mp4",
          "poster": "posters/R03_V.jpg",
          "frames": 181,
          "fps": 60,
          "start": 0.0,
          "end": 3.0,
          "encodedDuration": 3.0166666666666666
        }
      },
      "duration": 3.0,
      "cut": 1.0
    },
    {
      "id": "R04",
      "group": "rigid",
      "groupLabel": "刚体与关节",
      "name": "耦合运动的双连杆摆",
      "short": "双连杆摆",
      "en": "Articulated double pendulum",
      "topic": "有限惯量与关节耦合",
      "description": "两根有质量与惯量的杆通过铰链相连。改变第二关节的初始角度，或锁住该关节，比较耦合摆动的变化。",
      "engine": "Newton · Featherstone",
      "source": "官方双方杆模型的错层铰接派生版；两杆沿共同铰轴分层，原生仿真和 GT 重新生成。",
      "url": "https://github.com/newton-physics/newton/tree/1a497c00ed255db343e39eec4d614864c9aa9b95",
      "version": "几何修正版 v002",
      "scope": "完整积分窗口无实体杆交叠；重复、半步长、关节锚点、能量和独立有限惯量方程检查。",
      "A": [
        "第二关节初始相对角",
        "0°",
        "+60°"
      ],
      "E": [
        "第二关节的约束",
        "转动铰链",
        "锁定为 0°"
      ],
      "note": "展示采用错层铰接 v002。金色轴销为跟随父杆的无质量可视附件，其运动也有对应 GT。",
      "release": "Rigid4_Eval_v2_20261110",
      "fps": 100,
      "interventions": {
        "A": "只将第二关节初始相对角0改为+π/3，初始速度仍为0。",
        "E": "只将第二个转动关节锁定为零相对角的固定关节；保留质量、惯性与REF初态。"
      },
      "clips": {
        "REF": {
          "src": "media/R04_REF.mp4",
          "poster": "posters/R04_REF.jpg",
          "frames": 401,
          "fps": 100,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.01
        },
        "T_OBS": {
          "src": "media/R04_T_OBS.mp4",
          "poster": "posters/R04_T_OBS.jpg",
          "frames": 150,
          "fps": 100,
          "start": 0.0,
          "end": 1.49,
          "encodedDuration": 1.5
        },
        "T_FUTURE": {
          "src": "media/R04_T_FUTURE.mp4",
          "poster": "posters/R04_T_FUTURE.jpg",
          "frames": 251,
          "fps": 100,
          "start": 1.5,
          "end": 4.0,
          "encodedDuration": 2.51
        },
        "A": {
          "src": "media/R04_A.mp4",
          "poster": "posters/R04_A.jpg",
          "frames": 401,
          "fps": 100,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.01
        },
        "E": {
          "src": "media/R04_E.mp4",
          "poster": "posters/R04_E.jpg",
          "frames": 401,
          "fps": 100,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.01
        },
        "V": {
          "src": "media/R04_V.mp4",
          "poster": "posters/R04_V.jpg",
          "frames": 401,
          "fps": 100,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.01
        }
      },
      "duration": 4.0,
      "cut": 1.5
    },
    {
      "id": "S01",
      "group": "cloth",
      "groupLabel": "布料",
      "name": "多层布料的支撑披覆",
      "short": "多层披覆",
      "en": "Layered cloth draping",
      "topic": "重力下落与支撑成形",
      "description": "五层布料从释放开始下落，在针状支撑上形成褶皱。改变水平初始位置，或将单针换成双针。",
      "engine": "PPF Contact Solver",
      "source": "PPF needle.ipynb 的固定模型；展示为已验收的布料与支撑投影。",
      "url": "https://github.com/st-tech/ppf-contact-solver/tree/ac4084729b457a5d66ebc62424ff4836b3587360",
      "version": "PPF · ac40847",
      "scope": "固定源离散模型；重复性、保存帧几何和视频／GT 一致性检查。步长敏感性单独披露。",
      "A": [
        "布料整体初始水平偏移",
        "0",
        "+0.85 源长度单位"
      ],
      "E": [
        "支撑布局",
        "单针",
        "双针"
      ],
      "note": "采用从释放开始的布料下落与成形窗口。原生固定球与布料全程分离，展示投影中去除该球。",
      "release": "Cloth4_Eval_v1_20261110",
      "fps": 60,
      "interventions": {
        "A": "五层布料初始位置沿源X整体偏移+0.85源长度单位；其余初态与求解设置不变。",
        "E": "单针支撑改为两个相同支撑，位于源X=-0.5和+0.5；其余不变。"
      },
      "clips": {
        "REF": {
          "src": "media/S01_REF.mp4",
          "poster": "posters/S01_REF.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "T_OBS": {
          "src": "media/S01_T_OBS.mp4",
          "poster": "posters/S01_T_OBS.jpg",
          "frames": 25,
          "fps": 60,
          "start": 0.0,
          "end": 0.4,
          "encodedDuration": 0.4166666666666667
        },
        "T_FUTURE": {
          "src": "media/S01_T_FUTURE.mp4",
          "poster": "posters/S01_T_FUTURE.jpg",
          "frames": 35,
          "fps": 60,
          "start": 0.4166666666666667,
          "end": 0.9833333333333333,
          "encodedDuration": 0.5833333333333334
        },
        "A": {
          "src": "media/S01_A.mp4",
          "poster": "posters/S01_A.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "E": {
          "src": "media/S01_E.mp4",
          "poster": "posters/S01_E.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        },
        "V": {
          "src": "media/S01_V.mp4",
          "poster": "posters/S01_V.jpg",
          "frames": 60,
          "fps": 60,
          "start": 0.0,
          "end": 0.9833333333333333,
          "encodedDuration": 1.0
        }
      },
      "duration": 0.9833333333333333,
      "cut": 0.4166666666666667
    },
    {
      "id": "S02",
      "group": "cloth",
      "groupLabel": "布料",
      "name": "悬挂布与地面接触",
      "short": "悬挂布落地",
      "en": "Hanging cloth contact",
      "topic": "薄壳变形与地面接触",
      "description": "悬挂布的自由部分在重力下运动并接触地面。改变自由节点的初始速度，或改变地面的倾斜方向。",
      "engine": "Newton · VBD",
      "source": "固定 Newton 官方悬挂布样例，保留原生网格、材料和求解器。",
      "url": "https://github.com/newton-physics/newton/tree/1a497c00ed255db343e39eec4d614864c9aa9b95",
      "version": "Newton · 1a497c0",
      "scope": "固定离散源模型；六次完整重复，原生子步、接触和步长／迭代敏感性记录。",
      "A": [
        "自由节点初始 X 速度",
        "0",
        "−4 源长度单位/s"
      ],
      "E": [
        "地面绕 X 轴倾角",
        "0°",
        "20°"
      ],
      "note": "固定节点的初始速度保持为零。接触包络是离散模型设置，数值敏感性见数据说明。",
      "release": "Cloth4_Eval_v1_20261110",
      "fps": 60,
      "interventions": {
        "A": "只将自由节点初始X速度设为-4源长度单位/秒；固定点速度仍为零。",
        "E": "只将地面绕X倾斜20度。"
      },
      "clips": {
        "REF": {
          "src": "media/S02_REF.mp4",
          "poster": "posters/S02_REF.jpg",
          "frames": 101,
          "fps": 60,
          "start": 0.0,
          "end": 1.6666666666666656,
          "encodedDuration": 1.6833333333333333
        },
        "T_OBS": {
          "src": "media/S02_T_OBS.mp4",
          "poster": "posters/S02_T_OBS.jpg",
          "frames": 40,
          "fps": 60,
          "start": 0.0,
          "end": 0.6500000000000004,
          "encodedDuration": 0.6666666666666666
        },
        "T_FUTURE": {
          "src": "media/S02_T_FUTURE.mp4",
          "poster": "posters/S02_T_FUTURE.jpg",
          "frames": 61,
          "fps": 60,
          "start": 0.6666666666666671,
          "end": 1.6666666666666656,
          "encodedDuration": 1.0166666666666666
        },
        "A": {
          "src": "media/S02_A.mp4",
          "poster": "posters/S02_A.jpg",
          "frames": 101,
          "fps": 60,
          "start": 0.0,
          "end": 1.6666666666666656,
          "encodedDuration": 1.6833333333333333
        },
        "E": {
          "src": "media/S02_E.mp4",
          "poster": "posters/S02_E.jpg",
          "frames": 101,
          "fps": 60,
          "start": 0.0,
          "end": 1.6666666666666656,
          "encodedDuration": 1.6833333333333333
        },
        "V": {
          "src": "media/S02_V.mp4",
          "poster": "posters/S02_V.jpg",
          "frames": 101,
          "fps": 60,
          "start": 0.0,
          "end": 1.6666666666666656,
          "encodedDuration": 1.6833333333333333
        }
      },
      "duration": 1.6666666666666656,
      "cut": 0.6666666666666671
    },
    {
      "id": "S05",
      "group": "cloth",
      "groupLabel": "布料",
      "name": "运动球推动悬挂帘布",
      "short": "球推帘布",
      "en": "Driven curtain contact",
      "topic": "规定运动边界与多片布料",
      "description": "球沿给定轨迹穿过 15 片悬挂帘布。比较更快的相同位移驱动，以及不同顶边固定方式下的布料响应。",
      "engine": "PPF Contact Solver",
      "source": "PPF curtain.ipynb 的固定 CPU 离散模型。球是规定运动的碰撞边界。",
      "url": "https://github.com/st-tech/ppf-contact-solver/tree/ac4084729b457a5d66ebc62424ff4836b3587360",
      "version": "PPF · ac40847",
      "scope": "完整 6 秒原生记录与重复；几何、约束、源包重放和视频／GT 对应检查。",
      "A": [
        "相同 8 单位位移的驱动时长",
        "5 s",
        "3 s"
      ],
      "E": [
        "每片布的上方固定方式",
        "整条顶边",
        "顶部两角"
      ],
      "note": "球沿规定轨迹运动；T 外推需将已知未来驱动作为协议的一部分。布料步长敏感性单独披露。",
      "release": "Cloth4_Eval_v1_20261110",
      "fps": 60,
      "interventions": {
        "A": "球沿X移动8源长度单位的规定驱动时间从5秒改为3秒；总窗口仍为6秒。",
        "E": "只将每片布帘整条顶边固定改为顶部两角固定。"
      },
      "clips": {
        "REF": {
          "src": "media/S05_REF.mp4",
          "poster": "posters/S05_REF.jpg",
          "frames": 361,
          "fps": 60,
          "start": 0.0,
          "end": 6.0,
          "encodedDuration": 6.016666666666667
        },
        "T_OBS": {
          "src": "media/S05_T_OBS.mp4",
          "poster": "posters/S05_T_OBS.jpg",
          "frames": 120,
          "fps": 60,
          "start": 0.0,
          "end": 1.9833333333333334,
          "encodedDuration": 2.0
        },
        "T_FUTURE": {
          "src": "media/S05_T_FUTURE.mp4",
          "poster": "posters/S05_T_FUTURE.jpg",
          "frames": 241,
          "fps": 60,
          "start": 2.0,
          "end": 6.0,
          "encodedDuration": 4.016666666666667
        },
        "A": {
          "src": "media/S05_A.mp4",
          "poster": "posters/S05_A.jpg",
          "frames": 361,
          "fps": 60,
          "start": 0.0,
          "end": 6.0,
          "encodedDuration": 6.016666666666667
        },
        "E": {
          "src": "media/S05_E.mp4",
          "poster": "posters/S05_E.jpg",
          "frames": 361,
          "fps": 60,
          "start": 0.0,
          "end": 6.0,
          "encodedDuration": 6.016666666666667
        },
        "V": {
          "src": "media/S05_V.mp4",
          "poster": "posters/S05_V.jpg",
          "frames": 361,
          "fps": 60,
          "start": 0.0,
          "end": 6.0,
          "encodedDuration": 6.016666666666667
        }
      },
      "duration": 6.0,
      "cut": 2.0
    },
    {
      "id": "FLAG",
      "group": "cloth",
      "groupLabel": "布料",
      "name": "恒定风场中的旗帜",
      "short": "风中旗帜",
      "en": "Flag in steady wind",
      "topic": "风载变形与附着约束",
      "description": "旗帜在恒定风场中产生褶皱和摆动。比较风速变化，以及从竖边两端固定切换为顶部两角固定。",
      "engine": "ARCSim 0.2.1",
      "source": "ARCSim 作者代码的明确数值派生 v009，固定材料、网格和时间设置。",
      "url": "https://graphics.berkeley.edu/resources/ARCSim/",
      "version": "ARCSim · v009",
      "scope": "固定离散模型；完整原生重复、资产搬迁及冻结运行时复跑。数值敏感性单独披露。",
      "A": [
        "恒定风速向量",
        "[2, 0, 0] m/s",
        "[3, 0, 0] m/s"
      ],
      "E": [
        "旗帜附着点",
        "竖边两端",
        "顶部两角"
      ],
      "note": "A 保留已验收的 3 m/s 风场；展示不包含后续未通过验收的强风尝试。",
      "release": "Cloth4_Eval_v1_20261110",
      "fps": 25,
      "interventions": {
        "A": "只将恒定风速向量从[2,0,0]改为[3,0,0]m/s；采用已验收v009。",
        "E": "只将竖边两端附着改为顶部两角附着。"
      },
      "clips": {
        "REF": {
          "src": "media/FLAG_REF.mp4",
          "poster": "posters/FLAG_REF.jpg",
          "frames": 101,
          "fps": 25,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.04
        },
        "T_OBS": {
          "src": "media/FLAG_T_OBS.mp4",
          "poster": "posters/FLAG_T_OBS.jpg",
          "frames": 25,
          "fps": 25,
          "start": 0.0,
          "end": 0.96,
          "encodedDuration": 1.0
        },
        "T_FUTURE": {
          "src": "media/FLAG_T_FUTURE.mp4",
          "poster": "posters/FLAG_T_FUTURE.jpg",
          "frames": 76,
          "fps": 25,
          "start": 1.0,
          "end": 4.0,
          "encodedDuration": 3.04
        },
        "A": {
          "src": "media/FLAG_A.mp4",
          "poster": "posters/FLAG_A.jpg",
          "frames": 101,
          "fps": 25,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.04
        },
        "E": {
          "src": "media/FLAG_E.mp4",
          "poster": "posters/FLAG_E.jpg",
          "frames": 101,
          "fps": 25,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.04
        },
        "V": {
          "src": "media/FLAG_V.mp4",
          "poster": "posters/FLAG_V.jpg",
          "frames": 101,
          "fps": 25,
          "start": 0.0,
          "end": 4.0,
          "encodedDuration": 4.04
        }
      },
      "duration": 4.0,
      "cut": 1.0
    }
  ]
};
