# QV 面试题库

## 项目与简历

### 1. 先说一下这个 Agent 项目；它是做什么的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1cmrmtr%22%2C%22category%22%3A%22%E9%A1%B9%E7%9B%AE%E4%B8%8E%E7%AE%80%E5%8E%86%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%221%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这是面向医院的辅助导诊项目，目标是把患者描述整理成结构化信息，通过完整性检查、补问和科室匹配，辅助选择科室与医生。我主要负责文档解析、信息抽取、LangGraph 工作流，以及三层记忆架构设计。原型已有信息采集、科室路由、专科补问和规则回退能力；完整医生推荐、持久化恢复等按方案逐步完善。系统定位是辅助导诊，不替代医生诊断。

## 工程与性能

### 2. 如果拿一段线上报错日志，它能分析 bug、指出代码哪里有问题吗？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1xc6ip9%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%222%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**现有项目面向导诊，没有验证过代码故障诊断能力。如果扩展这个场景，我会让模型结合脱敏日志、异常堆栈、对应版本源码和近期变更提出定位假设，再通过复现或测试验证。堆栈可以指出报错位置，但报错位置不一定是根因；只有日志时，我会区分已知证据和待验证猜测，不能承诺准确定位到代码。

## Agent 与工具

### 3. 项目里的 LLM Runtime、Tool Runtime 分别负责什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dxuu0ey%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%223%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这两个名称不是所有框架统一的标准。在我的理解中，LLM Runtime 负责组织模型请求、传递上下文和工具描述，以及处理模型响应、超时和用量；Tool Runtime 负责验证工具名、参数和权限，执行工具并返回结果。模型提出调用意图，宿主程序决定是否执行。我项目中对应的是模型调用层和业务工具执行层，不把未独立实现的模块说成完整 Runtime。

## 模型与 Prompt

### 4. 模型路由的依据是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1c0gl41%22%2C%22category%22%3A%22%E6%A8%A1%E5%9E%8B%E4%B8%8E%20Prompt%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%224%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会先区分模型路由和业务路由：选择科室或专科节点是业务路由，选择哪一个大模型才是模型路由。模型选型先满足数据部署要求、上下文长度和结构化输出能力，再用同一批任务比较质量、延迟和成本。简单抽取与复杂生成可以采用不同配置，但是否动态切换需要评测支持，不能因为任务多就默认需要多模型。

> 备考备注（不口述）：简历未明确动态模型路由，本题按设计思路回答。

## 工程与性能

### 5. 错误重试是所有错误都会重试吗？参数错误怎么处理？

<!-- qv-meta:%7B%22id%22%3A%22q%2D17832d1%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%225%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**不会。网络抖动、限流和部分服务端错误可以按退避策略有限重试，并遵守总超时预算；鉴权失败、资源不存在等不能原样反复重试。参数错误先做 Schema 和业务校验，将具体错误反馈给模型修正，缺少必要信息就补问用户。涉及写操作时要检查幂等性和执行状态，避免超时重试造成重复提交。

### 6. 有流式输出吗？具体的流式响应是怎么处理的？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dc75b8m%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%226%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**如果补充流式能力，我会让后端接收模型或 LangGraph 的事件流，再通过 SSE 向前端推送进度和允许展示的内容。导诊可以先展示“正在核对信息”等节点进度，科室和医生结果必须完整校验后再展示，不能直接透传未经检查的 token。实现时还要处理心跳、断连取消、代理缓冲及事件去重。

> 备考备注（不口述）：[LangGraph 流式文档](https://docs.langchain.com/oss/python/langgraph/streaming) 材料未明确实际流式实现；被问到“做没做”时按真实情况回答。

### 7. SSE 和普通 HTTP 连接有什么区别？

<!-- qv-meta:%7B%22id%22%3A%22q%2D69zryt%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%227%22%2C%22tags%22%3A%5B%22SSE%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**SSE 本身就基于 HTTP。常见接口返回一次完整响应，SSE 则使用 text/event-stream，在同一次响应中持续发送事件，客户端可以边接收边处理。HTTP 本身也支持持久连接和流式传输，所以不能简单说 HTTP 是短连接。浏览器 EventSource 支持自动重连和事件 ID，但服务端仍需实现事件保存与补发，才能真正恢复遗漏消息。

> 备考备注（不口述）：[WHATWG SSE 标准](https://html.spec.whatwg.org/multipage/server-sent-events.html)

### 8. SSE 和 WebSocket 有什么区别？WebSocket 是半双工吗？

<!-- qv-meta:%7B%22id%22%3A%22q%2D10lmmrt%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%228%22%2C%22tags%22%3A%5B%22SSE%22%2C%22WebSocket%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**WebSocket 是全双工，连接建立后双方都可以主动发送消息；SSE 的事件流方向是服务端到客户端，用户提交消息通常走另一个 HTTP 请求。只需要推送生成内容或任务进度时，SSE 比较直接；需要频繁双向交互、实时音频或二进制传输时，可考虑 WebSocket。两者都需要鉴权、心跳和断线处理，不能只根据“长连接”选型。

> 备考备注（不口述）：[SSE 标准](https://html.spec.whatwg.org/multipage/server-sent-events.html)；[WebSocket 标准](https://www.rfc-editor.org/rfc/rfc6455)

### 12. 工具有超时吗？工具是并发调用的吗？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1vrjfna%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2212%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会给模型和工具分别设置超时，同时设置整个请求的截止时间。能否并发取决于数据依赖：科室确定后才能推荐医生，这两个步骤不能直接并发；互不依赖、只读的查询可以限量并发。还要给并发结果规定合并规则，避免多个节点覆盖同一字段。超时后除返回错误，还应尽可能取消底层任务，防止后台继续占用资源。

### 14. Trace 的 Hook 是怎么设计的，分为哪几层？

<!-- qv-meta:%7B%22id%22%3A%22q%2D4gnbmd%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2214%22%2C%22tags%22%3A%5B%22Trace%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**如果设计 Trace，我会在请求入口、工作流节点、模型与工具调用三个层面埋点，用同一个 trace ID 串联，以父子 span 表示调用关系。Hook 覆盖开始、结束、异常和重试，记录耗时、状态、模型与提示词版本、token 用量及脱敏摘要。异步调用也要传递追踪上下文。分层是便于定位问题的设计选择，不是框架强制规定。

> 备考备注（不口述）：[OpenTelemetry Trace 概念](https://opentelemetry.io/docs/concepts/signals/traces/)

### 15. 用户的一次请求在最终的 Trace 展示上是什么形式？Trace 具体怎么用，会做分析吗？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1m37q0y%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2215%22%2C%22tags%22%3A%5B%22Trace%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**通常是一棵调用树或时间瀑布图：入口下面是编排节点，再下面是模型、工具和检索调用。一个多轮会话可能对应多个请求 Trace，用会话 ID 关联。分析时先看错误节点和关键路径，再区分排队、模型推理或工具耗时；还可以对比失败与成功样本的输入和版本。Trace 能帮助定位过程问题，但业务结论是否正确仍要单独评测。

> 备考备注（不口述）：[OpenTelemetry Trace 概念](https://opentelemetry.io/docs/concepts/signals/traces/)

### 16. 有没有通过 Trace 分析过中间某个节点出问题的情况？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dxjjhhp%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2216%22%2C%22tags%22%3A%5B%22Trace%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这部分我先按排查思路说明。以推荐了无效医生为例，我会沿节点检查：上游候选是否有效、模型是否生成了越界 ID、输出校验是否拦截、降级分支是否误放行。找到首次产生错误的环节后，保留脱敏输入和配置版本，验证修复，并将案例加入回归集。关键是定位错误从哪里产生、又为什么没有被后续检查拦住。

> 备考备注（不口述）：这是分析示例，材料未记录真实 Trace 故障。若被追问亲历案例，应明确区分，不将假设改写为线上经历。

## 记忆与上下文

### 17. Memory 是怎么设计的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1wpj1gk%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2217%22%2C%22tags%22%3A%5B%22Memory%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我的设计分三层：用户记忆保存经过确认、可跨会话参考的信息；LangGraph 状态保存当前流程阶段、已收集事实和节点结果；当前会话上下文保存本轮对话和临时信息。三层是逻辑职责划分，可以有关联，不等于三个独立数据库。调用模型时按任务组装所需内容，历史信息还要检查来源和时效；模型推测不能直接沉淀成患者事实。

## 评测与安全

### 18. 不同用户之间是怎么隔离的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1jkxvng%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2218%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**生产实现中，我会同时校验用户身份和会话归属。服务端根据登录身份确定用户，读取 thread、长期记忆、附件和检索资料时都带权限范围；缓存键也必须包含用户或租户标识。thread_id 只是定位会话，不能当作授权凭证。还要测试篡改会话 ID、跨用户检索和共享缓存等越权路径，不能只靠前端隐藏入口。

## 记忆与上下文

### 19. Checkpoint 保存了哪些内容？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1b74na9%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2219%22%2C%22tags%22%3A%5B%22Checkpoint%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**LangGraph 的 checkpoint 用于保存线程内的执行进度，包括当时的状态值、后续节点、元数据，以及任务或中断等恢复信息；具体内容取决于状态定义和框架版本。恢复需要关联同一 thread，并使用合适的 checkpointer。它不是模型 KV Cache，也不自动代表跨会话长期记忆。原型中的内存状态不能等同于已经实现了进程重启后的可靠恢复。

> 备考备注（不口述）：[LangGraph 持久化文档](https://docs.langchain.com/oss/python/langgraph/persistence)；[LangGraph 中断恢复](https://docs.langchain.com/oss/python/langgraph/interrupts)。追问时注意：恢复使用同一 thread_id 和 Command(resume=...)，中断所在节点会从头重执行，interrupt 之前的副作用需要幂等。

## Agent 与工具

### 20. 为什么设计主子 Agent？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dkyjel4%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2220%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**导诊中信息抽取、完整性检查和专科适配的目标不同，拆分后可以分别定义输入输出、上下文和校验规则；编排层负责顺序、状态和异常处理。不过节点增多会增加延迟、成本和维护负担，所以明确的字段校验应直接写规则。我项目更接近受控工作流中的专业化模型节点，不需要把每个步骤都做成能自主规划的 Agent。

## RAG 与检索

### 24. 说一下 RAG 的原理，以及为什么要用 RAG。

<!-- qv-meta:%7B%22id%22%3A%22q%2Dyo33g9%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2224%22%2C%22tags%22%3A%5B%22RAG%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**RAG 是先从外部资料检索相关证据，再把证据和问题交给模型生成回答。我的颈椎项目用它检索与影像分级和个人信息相关的参考建议，让报告有可更新的资料依据。它适合知识需要更新或需要追溯来源的场景，但不能自动保证正确：检索错、资料旧，或者模型没有忠实使用证据，仍然会产生问题。

### 25. RAG 的流程是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dprr4r0%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2225%22%2C%22tags%22%3A%5B%22RAG%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**离线阶段先整理资料、划分内容单元、保留来源，再用编码模型生成向量并建立索引。在线阶段构造查询、向量召回、精排和去重，组装证据上下文后生成回答并校验。在我的颈椎项目里，技术链路是 Elasticsearch、BGE 召回、Reranker 精排，选出前五条内容后交给大模型生成参考报告。前五条是精排结果数，不等于最初只召回五条。

### 26. 项目的原始语料是什么，是 PDF 吗？PDF 是怎么解析的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1elyvzb%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2226%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这里需要区分两个项目：导诊项目处理患者病历和报告，包括 Word、PDF、图片；颈椎 RAG 的检索资料是整理标注的病情信息及对应建议，不能统一说成 PDF 知识库。导诊中 Word 做文本提取，PDF 和图片接入 MinerU，再让大模型按字段抽取信息。解析后还应检查阅读顺序、表格对应关系和 OCR 错误，解析成功不代表事实抽取一定正确。

> 备考备注（不口述）：[MinerU 官方仓库](https://github.com/opendatalab/MinerU)

### 27. 为了保证连续语义，文本具体怎么切分？有什么算法？

<!-- qv-meta:%7B%22id%22%3A%22q%2D16iukbh%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2227%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会先按文档结构切分，如标题、段落或完整业务条目，超过长度限制后再递归按句子和 token 切分，并适量重叠。也可以用相邻句向量相似度判断语义边界，但要额外计算。对颈椎项目的“病情—建议”条目，我会优先保持对应关系；长表格分块时带上表头和单位。具体采用过哪种切分器及参数，应以实际代码为准。

### 28. 表格为什么要转成 HTML？有什么好处？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1ccofcx%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2228%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**HTML 可以明确表达行列、表头和合并单元格，比较适合保留复杂表格结构；直接拼成普通文本容易混淆某个数值对应哪个指标或单位。但 HTML 更占 token，也不是所有表格都必须转换。简单表格可以用 Markdown，检索时也可以转成带表头的结构化记录。展示 HTML 时要做安全清洗，不能直接执行文档中的脚本。

### 29. Chunk 太大或太小有什么影响？Chunk 大小怎么确定？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dxy4d8%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2229%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**太小容易拆散条件、结论和单位，召回后信息不完整；太大则容易混入无关内容，增加上下文成本，也可能稀释向量表达。我会先按完整业务条目切分，再在开发集比较不同长度和重叠比例，观察证据召回、答案正确性与延迟。不存在通用最优长度，还要考虑 embedding 模型输入上限以及表格、报告等资料类型。

### 30. 为什么选择混合召回？

<!-- qv-meta:%7B%22id%22%3A%22q%2D4fnvsu%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2230%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我的简历记录的是 BGE 向量召回加精排，不能直接说项目采用了混合召回。如果扩展，原因是关键词检索擅长精确术语、编号，向量检索擅长同义表达，二者可以互补。可以分别召回、去重融合后再精排，但是否优于单路检索，要在同一评测集验证，也要考虑增加的延迟。

> 备考备注（不口述）：[Elastic 混合检索文档](https://www.elastic.co/docs/solutions/search/hybrid-search)

### 31. BM25 和向量检索分别解决什么类型的问题？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1j0xhws%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2231%22%2C%22tags%22%3A%5B%22BM25%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**BM25 基于词项匹配，结合词频、逆文档频率和长度归一化，适合专有名词、错误码等精确表达，但依赖分词和词面重合。向量检索比较语义表示，更适合同义改写，但可能忽略否定、数字或实体差异。权限、日期、患者标识这类硬条件，应做字段过滤，不能只靠相关性排序保证。

### 32. 有没有通过实验分析向量检索及混合检索带来的提升？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1odyvfg%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2232%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这类提升需要有对照实验才能下结论，我先说明验证方法：固定语料、切分、生成模型和测试集，对比 BM25、向量、混合以及各自加精排的组合；既控制候选数量，也比较相同延迟预算。检索看 Recall@K、MRR 或 nDCG，最终看答案正确性、证据支持和耗时，再按精确术语、同义表达等题型分析差异。

> 备考备注（不口述）：材料没有混合检索对照实验或提升数字；有无做过及实际结果按真实记录回答。

### 33. RRF 具体是什么算法？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1hnz8p0%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2233%22%2C%22tags%22%3A%5B%22RRF%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**RRF 根据名次融合多路检索，不直接相加原始相似度分数。某文档的融合分数是各路 1/(k＋名次) 的和，名次从 1 开始，某路未召回就不贡献。比如 k=60，一篇文档两路排名都是第二，得分是 2/62。它避免了不同分数尺度难比较的问题，但也舍弃了原始分数差距。

> 备考备注（不口述）：[Elastic RRF 公式](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)

## Agent 与工具

### 34. 为什么不直接加权？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dup6fqe%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2234%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**BM25 分数和向量相似度的尺度、分布不同，原始分数直接加权，某一路可能因为数值大而主导。RRF 用名次绕开尺度问题。线性加权也能用，但需要归一化或校准，并在开发集调权重。如果有稳定标注和合适的分数处理，加权融合也可能更好，RRF 并非始终最优。

> 备考备注（不口述）：[Elastic 融合方式](https://www.elastic.co/docs/reference/query-languages/esql/commands/fuse)

## RAG 与检索

### 35. RRF 中的常数是怎么确定的？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dvob2op%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2235%22%2C%22tags%22%3A%5B%22RRF%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**k 控制对头部排名的偏好：越小，靠前名次的优势越明显；越大，名次差距影响越平缓。Elasticsearch 的 rank_constant 默认是 60，可作为实验起点，不能说是我的最优参数。我会在开发集验证，并同时观察每路召回窗口大小；k 和返回结果数量 Top-K 是两个不同参数。

> 备考备注（不口述）：[Elastic RRF 参数](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)

## 评测与安全

### 36. 评测集是怎么做的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D7wb19r%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2236%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**如果建设评测集，我会区分导诊和 RAG：导诊样本标注可接受科室、缺失字段及是否应补问或转人工；RAG 样本标注问题、支持证据和可接受答案。覆盖正常、模糊、否定、冲突、无答案和故障场景，并按患者或文档来源隔离开发集与测试集，避免相近样本泄漏。医疗业务标签需要专业人员复核，不能仅用模型生成答案充当标准答案。

> 备考备注（不口述）：这是建设思路；方案提到基础测试，但材料未提供完整评测规模和成绩。

## RAG 与检索

### 37. 业务实体、时间等信息是在召回前还是召回后提取？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dhh43px%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2237%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**两处都有作用。建库时将文档的实体、时间和版本保存为元数据；查询时先提取用户明确给出的条件，归一化后用于检索。权限范围必须在检索边界强制执行，不能只在最后删掉结果。召回后再核对实体一致性、资料时效和冲突。含糊日期或不确定实体不应强行作为硬过滤条件，否则可能把正确证据提前排除。

## 评测与安全

### 39. 有什么办法验证 Agent 的结论是否正确？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dlsyomc%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2239%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会分三层验证：Schema 检查结构，程序规则检查实体、权限和流程约束，业务评测检查结论是否合理。导诊中医生 ID 有效只是必要条件，还要看所属科室和服务范围是否匹配。测试集要覆盖信息不足、跨科和异常分支，并由专业人员复核业务结论。模型自评或自报置信度只能辅助，不能单独作为正确性的证明。

### 40. 结论会有引用吗？引用是怎么在结论中体现和实现的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D19m9fe2%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86%20%E9%A1%B9%E7%9B%AE%E4%B8%8E%E5%9F%BA%E7%A1%80%E8%BF%BD%E9%97%AE%22%2C%22sourceNumber%22%3A%2240%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**如果实现引用，我会为证据保存稳定的文档或记录 ID、版本及页码等定位信息，生成时给片段编号，让回答关联这些编号，再由程序核对编号是否存在、证据是否支持对应结论。RAG 引用可指向检索资料，导诊依据则包括患者原文和院方配置。引用本身不保证正确，还要检查适用范围，不能让模型自行编造来源链接。

> 备考备注（不口述）：材料未明确完整的前端引用展示，本题按设计回答。

## 记忆与上下文

### 1. 大模型的优化：怎么解决上下文过长导致遗忘的问题；除了 Prompt，还可以怎么解决 AI Coding 写代码冗长复杂的问题？

<!-- qv-meta:%7B%22id%22%3A%22q%2D63r7s7%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%221%22%2C%22tags%22%3A%5B%22Prompt%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**上下文方面，我会保留目标、约束和结构化事实，按需检索历史，压缩重复工具输出，而不是无限追加消息。代码方面，先明确验收条件、接口和改动范围，把任务拆成可验证的小步，要求复用已有模块，再用测试、静态检查和代码评审约束结果。token 限制只能限制长度，不能保证设计简洁；压缩代码也不能牺牲可读性。

## Agent 与工具

### 2. Multi-agent 的设计逻辑思路是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D3motyp%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%222%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会先看任务是否确实需要不同上下文、工具权限或专业职责，再决定拆分 Agent。导诊中抽取、专科适配和结果校验可以分别设计接口，编排层管理状态、依赖和失败路径。确定性工作交给代码，无依赖任务才并发。最后用成功率、成本和延迟验证拆分是否有效，多 Agent 的数量本身不是先进程度。

## 模型与 Prompt

### 3. 为什么选 7B？不是 32B？逻辑是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1hfpylf%22%2C%22category%22%3A%22%E6%A8%A1%E5%9E%8B%E4%B8%8E%20Prompt%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%223%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会先澄清任务和实际模型配置，不能为了迎合题目说自己做过 7B、32B 对比。选型先满足部署、上下文和工具调用要求，再在相同业务集上比较任务成功率、结构化输出有效率、P95 延迟及显存成本。如果小模型达标就有成本优势，复杂任务可考虑更大模型。参数量只是一个因素，还要看架构、量化和推理配置。

### 4. Prompt 工程、Context 工程、Harness 工程有什么区别？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1ljqajq%22%2C%22category%22%3A%22%E6%A8%A1%E5%9E%8B%E4%B8%8E%20Prompt%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%224%22%2C%22tags%22%3A%5B%22Prompt%22%2C%22Harness%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**Prompt 工程关注怎样表达任务、示例和输出要求；Context 工程关注每一步给模型哪些事实、历史、证据和工具描述，以及如何更新和压缩；Harness 工程则关注支撑 Agent 运行的循环、工具执行、状态持久化、权限、观测和评测。三者有重叠，我的导诊项目可以分别对应提示词、三层上下文设计，以及 LangGraph 编排和输出校验。

## 记忆与上下文

### 5. 上下文限制问题怎么处理？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1wdadtn%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%225%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**要同时考虑硬长度上限和长文本中的注意力衰减。调用前给系统指令、任务输入、检索证据和输出预留 token 预算，超限时按优先级精简或分阶段处理。方案中单科约三四十名医生采用全量上下文，但不能因此保证模型不遗漏；需要测试不同排列和位置。超预算时不能静默删掉部分医生，应按方案降级或采用经过验证的分批策略。

## Agent 与工具

### 6. 如何提升 Agent 的 Function Call 能力？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dphruva%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%226%22%2C%22tags%22%3A%5B%22Agent%22%2C%22Function%20Call%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会先检查工具设计：名称和职责清晰，参数 Schema 明确必填项、类型、枚举和业务含义，避免大量功能相似的工具干扰选择。再用少量正反例说明什么时候调用、什么时候补问，并在支持时启用结构化输出约束。执行前仍需校验权限和业务条件。评测要分别看工具选对没有、参数是否正确，以及最终任务是否完成。

## 记忆与上下文

### 7. 上下文工程了解多少，长短期记忆如何做？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1uky9zd%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%227%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**上下文工程是按当前任务组织模型需要的信息，不等于把所有历史塞进提示词。短期记忆服务于本次会话和执行状态，长期记忆保存经确认、可跨会话复用的事实。我设计的三层架构进一步区分工作流状态与对话上下文。长期记录需要用户归属、来源、时间和有效性，读取时按需检索，写入时校验和确认，还要支持更正与删除。

### 8. 记忆覆盖问题如何解决？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1hif3p2%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%228%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会按字段合并信息，区分新增、补充、纠正和冲突，记录来源、时间与版本。新消息没提某字段，不能把旧值清空；旧记录里的“没有”也不能自动代表当前仍然没有。涉及症状变化或身份冲突时，先确认再更新，并保留历史。并发写入可以按会话串行化，或用版本号做乐观锁，不能简单以后写入者覆盖全部状态。

## 评测与安全

### 9. 介绍 RAG 流程；介绍编码模型的原理、优缺点；如何评估编码模型？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1q1svsq%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%229%22%2C%22tags%22%3A%5B%22RAG%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**在 RAG 语境里，我理解编码模型指 embedding 模型。它将查询和资料编码到可比较的向量空间，通常通过对比学习拉近相关样本，便于提前建库和快速召回；不足是可能混淆数字、否定或相近实体。我的项目用 BGE 召回，再由 Reranker 对查询和候选联合评分。编码模型评测看领域数据上的 Recall@K、MRR、耗时，再检查下游答案效果。

> 备考备注（不口述）：如果面试官指代码生成模型，应改谈代码任务、功能测试通过率及修复成功率。技术核对：[FlagEmbedding 官方仓库](https://github.com/FlagOpen/FlagEmbedding)。

### 10. RAG 怎么评估，评估体系中最重要的是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1kon2gn%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2210%22%2C%22tags%22%3A%5B%22RAG%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会分检索、生成和系统三层：检索看支持证据是否召回、排名是否靠前；生成看答案正确性、忠实性、引用支持和无答案时的处理；系统看延迟、成本与稳定性。最终以业务任务完成质量为目标。在医疗参考报告场景，我尤其关注关键结论是否有证据支持，以及信息不足时是否停止推断。高 Recall 不等于最终答案一定可靠。

## RAG 与检索

### 11. 传统 RAG 有什么痛点？GraphRAG 有哪些难点，如何应对增量场景？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dgrqpey%22%2C%22category%22%3A%22RAG%20%E4%B8%8E%E6%A3%80%E7%B4%A2%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2211%22%2C%22tags%22%3A%5B%22RAG%22%2C%22GraphRAG%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**普通向量 RAG 容易遗漏跨文档关系和全局主题。以微软 GraphRAG 为例，它抽取实体关系并生成社区摘要，支持围绕实体或全局问题检索；难点是实体消歧、抽取错误、建图成本和更新一致性。增量时需识别新增内容、合并实体，并更新受影响的索引与摘要；删除和关系变化还要处理失效依赖，不能只追加节点。我会把它作为扩展思路，不说项目已接入。

> 备考备注（不口述）：[GraphRAG 原理](https://microsoft.github.io/graphrag/)；[官方增量更新说明](https://www.microsoft.com/en-us/research/blog/moving-to-graphrag-1-0-streamlining-ergonomics-for-developers-and-users/)

## Agent 与工具

### 12. 你怎么理解 Harness？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1910oqq%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2212%22%2C%22tags%22%3A%5B%22Harness%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**在 Agent 场景中，Harness 是模型周围的执行环境，负责把“模型给出下一步”变成可持续、可控制的运行过程，通常包括上下文组装、工具执行、状态、权限、重试、停止条件和观测。它没有唯一固定架构。对应我的项目，LangGraph 提供部分编排能力，业务侧还要补充字段校验、白名单和降级规则，不能只靠模型提示词完成这些职责。

## 工程与性能

### 13. 多 Agent 并发有什么性能问题？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1p2k1t0%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2213%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**一是模型调用数和 token 消耗放大，可能触发限流或耗尽显存；二是工具和数据库连接池成为瓶颈；三是等待最慢分支拉高尾延迟。此外，并发写共享状态可能产生覆盖和顺序问题。我的处理思路是只并发无依赖任务，限制每个请求的分支数及全局并发，定义结果合并规则，并同时监测排队时间和实际执行时间。

### 14. 你平时怎么控制 Agent 并发量？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1brxrfs%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2214%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**如果负责生产化，我会在用户入口、单次工作流和模型或工具服务三个层面设限。进程内可用信号量控制在途调用，多实例需要共享配额或统一网关，配合有界队列和背压。额度依据压测、供应商限额及 token 负载调整。简历里的“20 并发”是视觉接口测试，不能当作导诊 Agent 的承载量。

## Agent 与工具

### 15. ReAct 的流程是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1j40mf1%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2215%22%2C%22tags%22%3A%5B%22ReAct%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**ReAct 将推理与行动交替进行：模型根据目标和已有观察决定下一步，提出工具调用，程序执行后把结果作为新观察送回模型，再继续行动或结束。推理本身不是执行，工具参数和权限仍由程序检查。运行时还需要步数、时间和重复动作限制。我的导诊方案采用显式状态图控制关键顺序，没有把整个流程交给自由 ReAct 循环。

> 备考备注（不口述）：[ReAct 原始论文](https://arxiv.org/abs/2210.03629)

### 16. Planner、Executor、Critic 分别怎么做？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dr30ye7%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2216%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**Planner 将目标拆成带依赖和完成条件的步骤；Executor 执行步骤并返回结果与证据；Critic 按验收条件检查结果，决定接受、修正或终止。三者是职责，可以由代码、模型或两者组合实现，不一定是三个独立模型。导诊中流程大多固定，更适合状态图承担规划，任务节点负责执行，程序校验配合专科复核检查结果，并设置有限重试。

## 工程与性能

### 17. 讲一下 Redis 的数据结构。Redis 是干什么用的？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1pjdoeu%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2217%22%2C%22tags%22%3A%5B%22Redis%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**Redis 是以内存访问为主的数据存储，常用于缓存、计数、限流和会话数据，也支持持久化。String 可存缓存和计数，Hash 存对象字段，List 存有序序列，Set 去重，Sorted Set 按分数排序，Stream 支持消息消费。选型要考虑过期、淘汰和恢复要求；如果保存重要工作流状态，不能把普通缓存的存活时间等同于可靠持久化。

> 备考备注（不口述）：[Redis 数据类型文档](https://redis.io/docs/latest/develop/data-types/)

## Agent 与工具

### 18. MCP 是什么？MCP 和 Skills 的区别是什么？模型怎么知道有这个工具？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1ylz444%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2218%22%2C%22tags%22%3A%5B%22MCP%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**MCP 是宿主应用与外部工具、资源等能力交互的协议；Skills 是封装任务做法的指令和资源包，可以包含脚本，也可以使用 MCP 工具。宿主通过 tools/list 获取有权限的工具及描述、参数 Schema，再提供给模型；模型提出调用后，由宿主校验并通过 tools/call 执行。模型不是自动扫描服务器就知道所有工具，协议也不替代权限控制。

> 备考备注（不口述）：[MCP 工具规范](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx)；[Agent Skills 定义](https://github.com/agentskills/agentskills/blob/main/docs/home.mdx)。原题编号“18.4”按第 18 题整理。

## 工程与性能

### 19. RPC 和 HTTP 分别有什么用？两者有什么区别？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dba7fer%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2219%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**RPC 是调用远程服务的一种交互方式，让调用方像使用方法一样访问远程能力；HTTP 是应用层协议，二者不是同层级的替代关系，RPC 可以通过 HTTP 实现，例如 gRPC 使用 HTTP/2。选型看调用方、接口契约和运维需求：浏览器或开放接口常用 HTTP API，内部强类型服务可考虑 gRPC。RPC 不天然更快，也需要处理网络失败和超时。

> 备考备注（不口述）：[gRPC 协议说明](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md)

## Agent 与工具

### 20. Agent 和普通工作流有什么区别？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dtwgblq%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2220%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**主要区别是执行路径由谁决定。普通工作流的步骤和分支主要由开发者预先定义；Agent 会根据目标和工具反馈，在授权范围内动态决定下一步。工作流中使用大模型，并不自动变成自主 Agent。我的导诊项目更适合显式工作流控制关键顺序，再让模型节点完成语义理解和候选判断，这样容易校验，也能保留必要灵活性。

### 21. LangChain 与 LangGraph 的核心区别？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dnk2aqa%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2221%22%2C%22tags%22%3A%5B%22LangGraph%22%2C%22LangChain%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**LangChain 提供模型、工具、检索及高层 Agent 等组件，适合快速组合应用；LangGraph 更侧重有状态的底层编排，可以明确控制节点、分支、循环和恢复。两者可以配合使用，当前 LangChain 的 Agent 也建立在 LangGraph 之上。因此不能说 LangChain 只能做线性链。我的项目选择 LangGraph，主要因为导诊需要明确状态和条件分支。

> 备考备注（不口述）：[LangChain 概览](https://docs.langchain.com/oss/python/langchain/overview)；[LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview)

## 记忆与上下文

### 22. 随着提问轮次增加，上下文窗口越来越大，如何解决？

<!-- qv-meta:%7B%22id%22%3A%22q%2D157y6qe%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2222%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会将保存历史和发送给模型的上下文分开：完整记录按权限保留，模型每轮只接收当前目标、结构化事实、必要近期消息和检索到的历史。旧工具输出可存引用，长对话可形成带来源摘要。压缩时保持工具调用与返回结果配对，不能只删前半段。事实有变化就按字段更新，不让已经过时的摘要持续影响回答。

### 23. 压缩或者摘要肯定会丢失信息，如何使损失最小？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1rhi0lo%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2223%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我会按对任务的影响分级：关键事实、否定词、时间、数字、单位和待确认冲突尽量结构化保留，重复描述再摘要。每条摘要关联原始记录，需要时可回查；压缩后检查关键字段和结论是否改变。导诊里“未提及”和“明确没有”必须区分。无法保证无损时，关键证据保留原文，不能为了压缩率牺牲业务正确性。

## 模型与 Prompt

### 24. 微调与 Prompt 的区别是什么？

<!-- qv-meta:%7B%22id%22%3A%22q%2D800rty%22%2C%22category%22%3A%22%E6%A8%A1%E5%9E%8B%E4%B8%8E%20Prompt%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2224%22%2C%22tags%22%3A%5B%22Prompt%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**Prompt 在推理时通过指令和示例影响行为，不更新模型权重，迭代快、成本低；微调通过训练更新全部或部分参数，适合稳定任务中的格式、风格或能力适配，但需要高质量数据和独立评测。RAG 则补充外部知识，三者可以组合。我会先用 Prompt 和工作流建立基线，错误持续且有足够训练样本时再考虑微调，不用微调替代频繁更新的知识库。

## 评测与安全

### 25. 降低幻觉不能只靠“请基于事实回答”，给出完整落地方案。

<!-- qv-meta:%7B%22id%22%3A%22q%2Dy0dzkj%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2225%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**结合导诊项目，我会从输入、生成、输出三层控制：输入保留原文证据，缺失信息明确标记；生成只提供当前有效科室、医生及相关规则；输出做 Schema、实体白名单、归属和依据校验。不满足条件时补问、有限重试或转人工，再通过独立测试集检查遗漏和越界。白名单只能防止虚构对象，不能保证对象推荐合理，因此还要验证业务匹配。

## Agent 与工具

### 26. 大模型 Function Call 的完整流程，如何将自然语言转为结构化参数？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dsvzndp%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2226%22%2C%22tags%22%3A%5B%22Function%20Call%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**先把用户任务及工具名称、描述和参数 Schema 提供给模型，模型生成工具调用和参数；服务端解析后校验类型、必填字段、业务条件及权限，通过后才执行。工具返回结果按调用 ID 关联给模型，模型再决定继续调用或生成答案。参数缺失时应补问，不能擅自填默认事实。Function Call 是提出调用意图，真正执行工具的是宿主程序。

## 模型与 Prompt

### 27. 讲讲 vLLM 的 KV Cache 原理；温度、top-p、top-k 如何设置？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dukty5b%22%2C%22category%22%3A%22%E6%A8%A1%E5%9E%8B%E4%B8%8E%20Prompt%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2227%22%2C%22tags%22%3A%5B%22vLLM%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**KV Cache 缓存历史 token 在各层的 Key、Value，生成新 token 时复用，避免重复计算历史 K/V，但仍要计算新查询与历史的注意力。vLLM 用分页块管理缓存，提高显存利用率。temperature 调整概率分布，top-p 按累计概率筛选，top-k 限制候选数量。我会先采用模型推荐配置，再按任务验证；低温度不保证事实正确，也不能一套参数用于所有模型。

> 备考备注（不口述）：[vLLM Paged Attention](https://docs.vllm.ai/en/latest/design/paged_attention/)；[采样参数](https://docs.vllm.ai/en/stable/api/vllm/sampling_params/)

## 评测与安全

### 28. 如何确保 Agent 不泄露敏感信息？从输入过滤和输出脱敏两方面说明。

<!-- qv-meta:%7B%22id%22%3A%22q%2D1900syg%22%2C%22category%22%3A%22%E8%AF%84%E6%B5%8B%E4%B8%8E%E5%AE%89%E5%85%A8%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2228%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**输入侧先鉴权，限制可访问数据范围，只提供完成任务所需字段，必要时将身份标识替换为可控代号；用户文本和检索资料都不能修改系统权限。输出侧检查敏感字段、引用和工具结果，日志与异常信息同样脱敏。关键是服务端权限和工具访问控制，不能仅靠模型自觉或关键词过滤；还要测试提示注入、跨用户读取和间接外传路径。

## Agent 与工具

### 29. 主 Agent 做任务规划时，怎么保证拆解步骤合理？用哪种 Prompt 策略？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dbpso4x%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2229%22%2C%22tags%22%3A%5B%22Agent%22%2C%22Prompt%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我的导诊方案中，核心顺序由 LangGraph 状态图约束，不让模型自由跳过完整性检查。对于需要模型辅助选择的步骤，我会明确角色、输入事实、允许动作、前置条件和结构化输出，并给少量边界示例；服务端再校验动作是否合法。如果是开放任务，可先生成计划再逐步执行，但计划必须能验证、有预算和停止条件，不能仅靠模型自我认可。

### 30. Function Call 返回的 JSON 不标准怎么解决？

<!-- qv-meta:%7B%22id%22%3A%22q%2D5mzben%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2230%22%2C%22tags%22%3A%5B%22Function%20Call%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**先区分 JSON 语法错误、Schema 不匹配和业务值错误。能用结构化输出或受约束解码时优先启用；随后使用 JSON 解析和 Schema 校验，再做业务检查。失败时把具体字段错误反馈给模型，有限次修正；关键信息缺失则补问，仍失败就降级。不能用 eval 执行文本，也不能随意修补医生 ID 等关键值；JSON 合法不代表参数正确。

### 31. 多 Agent 协作常见模式有哪些？

<!-- qv-meta:%7B%22id%22%3A%22q%2D4dw3ue%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2231%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**常见有顺序流水线、中心编排、并行分工后汇总、Agent 之间交接，以及生成—审查迭代。选择取决于依赖关系和责任边界：强依赖任务串行，可独立任务并行，跨职责任务可交接。导诊更适合中心编排加专业节点，统一管理状态、补问和校验。投票或多轮讨论不能天然消除错误，还可能增加成本和相同模型的共同偏差。

## 工程与性能

### 32. 多用户同时调用 API，任务一多就卡死，怎么设计？

<!-- qv-meta:%7B%22id%22%3A%22q%2Dlh0td3%22%2C%22category%22%3A%22%E5%B7%A5%E7%A8%8B%E4%B8%8E%E6%80%A7%E8%83%BD%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2232%22%2C%22tags%22%3A%5B%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**先定位瓶颈是事件循环被阻塞、请求排队、连接池耗尽，还是推理资源饱和。网络调用用异步，CPU 密集解析交给进程或专用 worker，GPU 推理由独立服务调度；入口配合限流、有界队列、超时和背压。会话状态外置后再考虑扩容。还要记录排队时长、P95 延迟和资源占用，不能认为加 async 或增加 worker 就会自动扩大模型吞吐。

## Agent 与工具

### 33. Agent 的停止条件是什么？怎样判断任务完成，如何处理反复调用同一工具等死循环？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1obr8hl%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2233%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**任务是否完成要结合可验证的验收条件，由执行层检查；同时设置最大步数、工具次数、token 和时间预算。针对循环，检测重复的工具名、参数及缺少新信息的返回，触发有限修正或终止。导诊方案还分别限制科室和医生的重新推荐次数，达到各自上限就转人工。模型可以提出结束，但不能自行取消程序设置的停止条件。

> 备考备注（不口述）：原题在“反复调用同”处截断，此处按原意补成完整问题。

### 34. 对最近的 DeepSeek Harness 有什么了解，使用过吗，有什么优势？

<!-- qv-meta:%7B%22id%22%3A%22q%2D13k1qa4%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2234%22%2C%22tags%22%3A%5B%22Harness%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**我了解它的官方开发者预览介绍：它把模型、工具、会话、沙箱和调度等能力做成可组合插件，并通过会话事件记录支持运行轨迹查看、恢复和重放。对我有吸引力的是可替换组件和排查执行过程的能力，便于比较模型与运行配置的影响。目前我的项目经验主要在 LangGraph，不能据此宣称已经接入或测出性能提升；实际选用还需验证接口成熟度、权限与成本。

> 备考备注（不口述）：截至 2026-09-21 核对：[DeepSeek Harness 官方介绍](https://www.deepseek.com/harness/en/)。现有材料未记录个人实操，因此本答按产品理解组织；若确实使用过，再补真实版本、任务和结果。

## 记忆与上下文

### 35. 在多 Agent 开发中，有没有遇到上下文传递丢失的问题？怎么解决？

<!-- qv-meta:%7B%22id%22%3A%22q%2D1gx4fj%22%2C%22category%22%3A%22%E8%AE%B0%E5%BF%86%E4%B8%8E%E4%B8%8A%E4%B8%8B%E6%96%87%22%2C%22section%22%3A%22%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%20Agent%20%E5%8E%9F%E7%90%86%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5%22%2C%22sourceNumber%22%3A%2235%22%2C%22tags%22%3A%5B%22Agent%22%5D%2C%22origin%22%3A%22markdown%22%7D -->

**回答：**这个问题我会先区分：字段有没有传过去，还是传了但模型没使用。前者检查节点输入输出、字段映射和状态合并，后者检查 token 截断、信息位置和干扰。我的设计思路是用结构化共享事实与来源记录，按节点职责组装上下文，并以关键事实是否保留作为回归检查点。字段齐全只能证明传输完整，还要验证下游节点确实使用了相关事实。

> 备考备注（不口述）：材料未提供已发生的具体故障；若问亲历案例，先如实说明，再讲方法，不把此答案包装成事故复盘。

## Agent 与工具

### 68. 这是一个测试案例222

<!-- qv-meta:%7B%22id%22%3A%22custom%2Dmub4kkrj%2D6v2tg%22%2C%22category%22%3A%22Agent%20%E4%B8%8E%E5%B7%A5%E5%85%B7%22%2C%22section%22%3A%22%E6%88%91%E7%9A%84%E6%96%B0%E5%A2%9E%E9%97%AE%E9%A2%98%22%2C%22sourceNumber%22%3A%22%22%2C%22tags%22%3A%5B%22test%22%5D%2C%22origin%22%3A%22custom%22%7D -->

**回答：**测试内容使用222
