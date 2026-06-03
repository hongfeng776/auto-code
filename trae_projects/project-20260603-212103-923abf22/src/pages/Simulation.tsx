import { useState } from 'react'
import {
  FlaskConical,
  Play,
  Settings2,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  Sliders,
  RotateCcw,
  Zap,
  ListChecks,
} from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import type { SimulationParams } from '@/types'

const DEFAULT_PARAMS: SimulationParams = {
  safetyStockDays: 7,
  consumptionMultiplier: 1.0,
  alertThreshold: 10,
  leadTimeBuffer: 2,
}

const PRESETS = [
  {
    label: '保守模式',
    params: { safetyStockDays: 14, consumptionMultiplier: 1.5, alertThreshold: 5, leadTimeBuffer: 3 },
  },
  {
    label: '标准模式',
    params: DEFAULT_PARAMS,
  },
  {
    label: '激进模式',
    params: { safetyStockDays: 5, consumptionMultiplier: 0.8, alertThreshold: 20, leadTimeBuffer: 1 },
  },
]

const TYPE_BADGE_MAP: Record<string, { label: string; color: string }> = {
  out_of_stock: { label: '断货', color: 'bg-red-500/20 text-red-400' },
  low_stock: { label: '低库存', color: 'bg-amber-500/20 text-amber-400' },
  supplier_missing: { label: '供应商缺失', color: 'bg-purple-500/20 text-purple-400' },
  lead_time_overdue: { label: '交期延误', color: 'bg-orange-500/20 text-orange-400' },
}

function SeverityIcon({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  switch (severity) {
    case 'critical':
      return <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
    case 'info':
      return <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
  }
}

function SeverityBorder(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'border-l-red-500'
    case 'warning':
      return 'border-l-amber-500'
    case 'info':
      return 'border-l-blue-500'
  }
}

export default function Simulation() {
  const simulationResults = useInventoryStore((s) => s.simulationResults)
  const simulationRun = useInventoryStore((s) => s.simulationRun)
  const simulationParams = useInventoryStore((s) => s.simulationParams)
  const runSimulation = useInventoryStore((s) => s.runSimulation)
  const getWarehouseById = useInventoryStore((s) => s.getWarehouseById)
  const getSkuById = useInventoryStore((s) => s.getSkuById)
  const alerts = useInventoryStore((s) => s.alerts)
  const getUnresolvedAlerts = useInventoryStore((s) => s.getUnresolvedAlerts)

  const [localParams, setLocalParams] = useState<SimulationParams>(simulationParams)

  const criticalCount = simulationResults.filter((r) => r.severity === 'critical').length
  const warningCount = simulationResults.filter((r) => r.severity === 'warning').length
  const infoCount = simulationResults.filter((r) => r.severity === 'info').length
  const overThreshold = simulationResults.length > localParams.alertThreshold

  const currentAlertCount = getUnresolvedAlerts().length

  function handlePreset(params: SimulationParams) {
    setLocalParams(params)
  }

  function handleRun() {
    runSimulation(localParams)
  }

  function handleReset() {
    setLocalParams(DEFAULT_PARAMS)
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">模拟预警中心</h1>
          <p className="text-xs text-gray-400">调节参数模拟不同场景下的库存预警情况</p>
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-6">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings2 className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-gray-200">模拟参数</h2>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>安全库存天数</span>
                <span className="text-amber-400 font-medium">{localParams.safetyStockDays} 天</span>
              </div>
              <input
                type="range"
                min={3}
                max={30}
                value={localParams.safetyStockDays}
                onChange={(e) =>
                  setLocalParams((p) => ({ ...p, safetyStockDays: Number(e.target.value) }))
                }
                className="w-full h-1.5 bg-dark-500 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>3</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>消耗倍率</span>
                <span className="text-amber-400 font-medium">×{localParams.consumptionMultiplier.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={localParams.consumptionMultiplier}
                onChange={(e) =>
                  setLocalParams((p) => ({
                    ...p,
                    consumptionMultiplier: Number(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-dark-500 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>0.5</span>
                <span>3.0</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>预警阈值</span>
                <span className="text-amber-400 font-medium">{localParams.alertThreshold} 条</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={localParams.alertThreshold}
                onChange={(e) =>
                  setLocalParams((p) => ({ ...p, alertThreshold: Number(e.target.value) }))
                }
                className="w-full h-1.5 bg-dark-500 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>5</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>提前期缓冲</span>
                <span className="text-amber-400 font-medium">{localParams.leadTimeBuffer} 天</span>
              </div>
              <input
                type="range"
                min={0}
                max={7}
                value={localParams.leadTimeBuffer}
                onChange={(e) =>
                  setLocalParams((p) => ({ ...p, leadTimeBuffer: Number(e.target.value) }))
                }
                className="w-full h-1.5 bg-dark-500 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>0</span>
                <span>7</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-dark-500">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">预设方案</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const isActive =
                  localParams.safetyStockDays === preset.params.safetyStockDays &&
                  localParams.consumptionMultiplier === preset.params.consumptionMultiplier &&
                  localParams.alertThreshold === preset.params.alertThreshold &&
                  localParams.leadTimeBuffer === preset.params.leadTimeBuffer
                return (
                  <button
                    key={preset.label}
                    onClick={() => handlePreset(preset.params)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-dark-600 text-gray-400 border border-dark-500 hover:border-gray-600 hover:text-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-dark-500 space-y-2">
            <button
              onClick={handleRun}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-dark-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Play className="w-4 h-4" />
              运行模拟
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-600 text-gray-400 text-sm font-medium rounded-lg border border-dark-500 hover:text-gray-200 hover:border-gray-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {!simulationRun ? (
            <div className="bg-dark-700 border border-dark-500 rounded-xl py-20 flex flex-col items-center justify-center">
              <FlaskConical className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm">调节参数后点击运行模拟</p>
              <p className="text-gray-600 text-xs mt-1">模拟将基于当前库存数据推演预警场景</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">预警总数</div>
                  <div className="text-2xl font-bold text-white">{simulationResults.length}</div>
                </div>
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3 text-red-400" />
                    严重
                  </div>
                  <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                </div>
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    警告
                  </div>
                  <div className="text-2xl font-bold text-amber-400">{warningCount}</div>
                </div>
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-blue-400" />
                    提示
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{infoCount}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-2">当前预警 vs 模拟预警</div>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-blue-500/60 rounded-t"
                        style={{
                          height: `${Math.max((currentAlertCount / Math.max(simulationResults.length, currentAlertCount, 1)) * 80, 8)}px`,
                        }}
                      />
                      <div className="text-[10px] text-gray-500 mt-1.5">当前</div>
                      <div className="text-sm font-bold text-blue-400">{currentAlertCount}</div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-amber-500/60 rounded-t"
                        style={{
                          height: `${Math.max((simulationResults.length / Math.max(simulationResults.length, currentAlertCount, 1)) * 80, 8)}px`,
                        }}
                      />
                      <div className="text-[10px] text-gray-500 mt-1.5">模拟</div>
                      <div className="text-sm font-bold text-amber-400">{simulationResults.length}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-2">模拟参数快照</div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">安全库存天数</span>
                      <span className="text-gray-200">{simulationParams.safetyStockDays}天</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">消耗倍率</span>
                      <span className="text-gray-200">×{simulationParams.consumptionMultiplier.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">预警阈值</span>
                      <span className="text-gray-200">{simulationParams.alertThreshold}条</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">提前期缓冲</span>
                      <span className="text-gray-200">{simulationParams.leadTimeBuffer}天</span>
                    </div>
                  </div>
                </div>
              </div>

              {overThreshold && (
                <div className="rounded-xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-red-500/10 p-5 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center animate-pulse">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-300">
                        模拟产生 {simulationResults.length} 条预警，超过阈值 {localParams.alertThreshold} 条
                      </div>
                      <div className="text-xs text-amber-400/70">需要启动批量处理流程</div>
                    </div>
                  </div>

                  <div className="bg-dark-800/60 border border-amber-500/20 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">批量处理方案</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-amber-400">1</span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-200">按供应商分组批量联系</div>
                          <div className="text-[10px] text-gray-500">将同一供应商的多个SKU预警合并处理，提高沟通效率</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-amber-400">2</span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-200">按仓库优先级批量补货</div>
                          <div className="text-[10px] text-gray-500">优先处理华北枢纽仓等高利用率仓库的预警</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-amber-400">3</span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-200">紧急寻源SKU清单</div>
                          <div className="text-[10px] text-gray-500">为无可用供应商的断货SKU启动寻源流程</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-dark-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Zap className="w-4 h-4" />
                    一键生成批量建议
                  </button>
                </div>
              )}

              <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    模拟预警列表
                  </h3>
                  <span className="text-xs text-gray-500">共 {simulationResults.length} 条</span>
                </div>
                <div className="space-y-2">
                  {simulationResults.map((alert) => {
                    const sku = getSkuById(alert.skuId)
                    const warehouse = getWarehouseById(alert.warehouseId)
                    const badge = TYPE_BADGE_MAP[alert.type] ?? {
                      label: alert.type,
                      color: 'bg-gray-500/20 text-gray-400',
                    }

                    return (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-3 rounded-lg bg-dark-600 border-l-[3px] ${SeverityBorder(alert.severity)} hover:bg-dark-500 transition-colors`}
                      >
                        <SeverityIcon severity={alert.severity} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                            {sku && (
                              <span className="text-xs text-gray-300 truncate">{sku.name}</span>
                            )}
                            {warehouse && (
                              <span className="text-[10px] text-gray-500 shrink-0">
                                {warehouse.name}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-300">{alert.message}</div>
                          <div className="text-[11px] text-amber-400/80 mt-1">
                            {alert.actionSuggestion}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
