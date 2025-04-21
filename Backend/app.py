from app import create_app

app = create_app()

if __name__ == '__main__':
    port = app.config.get("FLASK_RUN_PORT", 5000)
    debug = app.config.get("FLASK_DEBUG", False)
    app.run(port=port, debug=debug)
