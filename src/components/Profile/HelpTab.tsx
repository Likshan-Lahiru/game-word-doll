export function HelpTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div>
                <p className="text-sm text-gray-300 mb-4">
                    Have questions or need support?
                </p>
                <div className="flex items-center">
                    <span className="text-sm text-gray-300 mr-2">Email:</span>
                    <a
                        href="mailto:help@example.com"
                        className="text-blue-400 hover:underline"
                    >
                        help@example.com
                    </a>
                </div>
            </div>
        </div>
    )
}