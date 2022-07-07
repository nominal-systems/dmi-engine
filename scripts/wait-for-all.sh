# Wait for services
wget -q https://github.com/eficode/wait-for/releases/latest/download/wait-for
chmod +x ./wait-for
./wait-for -q redis:6379 -t 60 -- echo 'Redis is up' &
PID_REDIS=$!
./wait-for -q activemq:1883 -t 60 -- echo 'ActiveMQ is up' &
PID_ACTIVEMQ=$!

echo 'Waiting for all services to start...'
wait $PID_REDIS || { echo 'Redis connection timed out'; exit 1; }
wait $PID_ACTIVEMQ || { echo 'ActiveMQ connection timed out'; exit 1; }
echo 'Waited for all services successfully'
eval $1
