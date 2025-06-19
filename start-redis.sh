#!/bin/bash

# Redis 启动脚本
echo "🔄 启动 Redis 服务..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动 Redis 服务
docker-compose up -d redis

# 等待 Redis 启动
echo "⏳ 等待 Redis 服务启动..."
sleep 5

# 检查 Redis 连接
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 服务启动成功！"
    echo "📊 Redis 管理界面: http://localhost:8081"
    echo "🔌 Redis 连接地址: localhost:6379"
else
    echo "❌ Redis 服务启动失败"
    docker-compose logs redis
    exit 1
fi
