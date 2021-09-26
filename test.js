
        if(this.started) throw new Error("Server has already started");
        let [ ip, port ] = await parseAddress(this.address);
        this.#connection = net.createServer();
        this.#connection.on("connection", c => {
            let uid = this.generateUID();
            let timeout = setTimeout(() => c.end(), 10000);
            c.on("data", data => {
                let packet = DJSON.parse(data);
                super.emit("data", packet);
                switch(packet.type) {
                    case "AUTHENTICATE": {
                        if(
                            !("username" in packet) ||
                            typeof packet.username !== "string" || packet.username.length > 16
                        ) {
                            c.end(DJSON.stringify({
                                code: "INVALID_USERNAME",
                                message: "Username provided was invalid",
                                type: "ERROR"
                            }));
                            break;
                        };
                        let user = new User({
                            bot: !!packet.bot,
                            connection: c,
                            joinedTimestamp: Date.now(),
                            server: this,
                            uid,
                            username: packet.username
                        });
                        this.#users[uid] = user;
                        clearTimeout(timeout);
                        super.emit("authenticate", user);
                        break;
                    };
                    case "DISCONNECT": {
                        this.broadcast(packet);
                        break;
                    };
                    case "MESSAGE": {
                        if(
                            ![ "content", "createdTimestamp" ].every(k => k in packet) ||
                            typeof packet.content !== "string" ||
                            typeof packet.createdTimestamp !== "number"
                        ) {
                            c.end(DJSON.stringify({
                                code: "INVALID_MESSAGE",
                                message: "Message data was invalid",
                                type: "ERROR"
                            }));
                            break;
                        };
                        this.broadcast(packet);
                        super.emit("message", new Message({
                            content: packet.content,
                            createdTimestamp: packet.createdTimestamp,
                            server: this,
                            user: this.user(uid)
                        }));
                        break;
                    };
                };
            });
            c.on("end", () => {
                super.emit("disconnect", this.user(uid));
                if(uid in this.#users) delete this.#users[uid];
            });
            c.on("error", error => {
                super.emit("error", error);
                delete this.#users[uid];
            });
            super.emit("connect", c, uid);
        });
        this.#connection.on("end", () => this.end());
        this.#connection.on("error", error => {
            super.emit("error", error);
            this.end();
        });
        this.#connection.listen(port, ip);
        this.#startedTimestamp = Date.now();
        super.emit("start");