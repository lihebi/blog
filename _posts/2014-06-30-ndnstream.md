---

layout: hebi-post
title: NDNStream
location: Huaibei
time: 11:10:34

---

# 概述
路由收到interest后，检测是不是流interest。
如果是，则在收到相应的data后，重新加入一个pit，来收取下一个data。


# 实现
## ndnSIM代码修改

`model/fw/ndn-forwarding-strategy.cc`

```c
void
ForwardingStrategy::InsertAgain(Ptr<Face> inFace, Ptr<Data> data)
{
  std::string name = data->GetName().toUri();
  name[name.length()-1]++;
  std::cout<<"Insert pit:"<<name<<std::endl;
  const ndn::Name _name(name);
  Ptr<ndn::Interest> interest = Create<ndn::Interest>();
	UniformVariable rand(0, std::numeric_limits<uint32_t>::max());
	interest->SetNonce(rand.GetValue());
	interest->SetName(_name);
	interest->SetInterestLifetime(Seconds(2));

  Ptr<pit::Entry> pitEntry;
  pitEntry = m_pit->Create (interest);
  pitEntry->AddSeenNonce (interest->GetNonce ());
  pitEntry->AddIncoming (inFace);
  pitEntry->UpdateLifetime (interest->GetInterestLifetime ());
}
```

在函数`ForwardingStrategy::OnData`中的`while`语句前，加
```c
pitEntry->GetIncoming();
BOOST_FOREACH (const pit::IncomingFace &incoming, pitEntry->GetIncoming ())
{
  InsertAgain(incoming.m_face, data);
  // incoming.m_face;
}
```

然后在`.h`文件中加入`InsertAgain`的声明。

## 客户端代码

# Future Work

## ndnSIM代码
现在是直接在`ForwardingStrategy::OnData`中，无检测重新添加PIT。
可以在添加之前，检测是否是`流interest`。如果是，则添加，不是就跳过。
流interest可以在名字中检测是否有"/stream"前缀。

`InsertAgain`这个函数是将最后一个字符直接++，所以只有0-9。写个函数，把最后一个部分提取出来，转换成数字。
将其++后，转换成字符串再添加回去。

## 客户端代码
见repo的README
