FROM node:20.19.4-alpine3.22

RUN addgroup backend && adduser -S -G backend user01
USER user01

WORKDIR /app/
RUN mkdir datos

COPY --chown=user01:backend package*.json .

RUN npm install

COPY --chown=user01:backend . .

ENV API=PROOF_VALUE

EXPOSE 3000

CMD ["npm", "run", "dev"]