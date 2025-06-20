namespace BreathingFree.Services
{
    public static class NameHelper
    {
        public static string FormatFullName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return name;

            var words = name.Trim()
                            .Split(' ', StringSplitOptions.RemoveEmptyEntries);

            return string.Join(" ", words.Select(w =>
                char.ToUpper(w[0]) + w.Substring(1).ToLower()));
        }
    }
}
